import org.strangeeons.gradle.rendertest.BuildStrangeEons
import org.strangeeons.gradle.rendertest.PackagePluginFolder

plugins {
    id("org.strangeeons.render-test") version "1.0.1"
}

val projects = "${System.getProperty("user.home")}/Projects"

strangeEonsRenderTest {
    strangeEonsDir = file(providers.gradleProperty("strangeEonsDir").getOrElse("$projects/strange-eons"))
    pluginFolder = file("ArkhamHorrorLCG/ArkhamHorrorLCG")
    pluginBundleName = "ArkhamHorrorLCG.seext"
    // -PcomponentsDir renders another fixture set against the same masters
    components = file(providers.gradleProperty("componentsDir").getOrElse("src/renderTest/components"))
    // high-res templates; catches sub-pixel layout shifts
    resolution = 300
}

val fixtureScript = file("src/renderTest/generate-fixtures.js")

// Runs the fixture script in Strange Eons with the packaged plug-in.
fun Exec.runFixtureScript(mode: String, out: File, work: File, overwrite: Boolean = false) {
    val buildSe = tasks.named<BuildStrangeEons>("buildStrangeEons")
    val pack = tasks.named<PackagePluginFolder>("packagePluginFolder")
    dependsOn(buildSe, pack)
    val launcher = strangeEonsRenderTest.launcher
    isIgnoreExitValue = true
    doFirst {
        work.deleteRecursively()
        val user = work.resolve("user").apply { mkdirs() }
        user.resolve("preferences").writeText("")
        val lib = buildSe.get().installDir.get().asFile.resolve("lib")
        val cp = lib.listFiles { f -> f.name.endsWith(".jar") }!!.sorted().joinToString(File.pathSeparator)
        environment("STRANGE_EONS_USER_DIR", user.absolutePath)
        commandLine(
            launcher.get().executablePath.asFile.absolutePath,
            "--add-opens=java.desktop/javax.swing.table=ALL-UNNAMED",
            "--enable-native-access=ALL-UNNAMED",
            "-Dfx.mode=$mode",
            "-Dfx.out=${out.absolutePath}",
            "-Dfx.results=${work.resolve("results.txt").absolutePath}",
            "-Dfx.overwrite=$overwrite",
            "-cp", cp,
            "ca.cgjennings.apps.arkham.StrangeEons",
            "--xDisableJreCheck", "--xDisablePluginLoading",
            "--glang", "en", "--ulang", "en",
            "--plugintest", pack.get().bundle.get().asFile.absolutePath,
            "--run", fixtureScript.absolutePath,
        )
    }
    doLast {
        val results = work.resolve("results.txt")
        if (!results.exists() || results.readLines().lastOrNull() != "DONE") {
            throw GradleException("Fixture script stopped early. See $results")
        }
        val failed = results.readLines().filter { it.startsWith("FAIL") }
        failed.forEach { logger.error(it) }
        if (failed.isNotEmpty()) throw GradleException("${failed.size} handler(s) failed. See $results")
    }
}

// Card handlers share CARD_VERSION.
val verifyCardVersions by tasks.registering {
    group = "verification"
    description = "Checks that card handlers use CARD_VERSION."
    val diy = file("ArkhamHorrorLCG/ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy")
    inputs.dir(diy)
    doLast {
        val util = diy.resolve("AHLCG-utilLibrary.js").readText()
        val current = Regex("""const CARD_VERSION = (\d+);""").find(util)?.groupValues?.get(1)?.toInt()
            ?: throw GradleException("CARD_VERSION not found")
        val problems = mutableListOf<String>()
        diy.listFiles { f -> f.name.endsWith(".js") && !f.name.startsWith("AHLCG") }!!.sorted().forEach { f ->
            val text = f.readText()
            if (Regex("""diy\.version\s*=\s*\d""").containsMatchIn(text)) problems += "${f.name} sets a literal version"
            if (Regex("""diy\.version\s*=\s*CARD_VERSION""").findAll(text).count() != 2) {
                problems += "${f.name} does not set CARD_VERSION in create and onRead"
            }
        }
        if (problems.isNotEmpty()) throw GradleException(problems.joinToString("\n"))
        logger.lifecycle("CARD_VERSION $current")
    }
}

tasks.named("check") { dependsOn(verifyCardVersions) }

// Writes .eon fixtures with the current plug-in. Existing fixtures are kept
// unless -PoverwriteFixtures is set, since they also guard save compatibility.
// -PfixturesDir writes them elsewhere.
val generateFixtures by tasks.registering(Exec::class) {
    group = "render test"
    description = "Creates the render-test .eon fixtures with Strange Eons."
    runFixtureScript(
        "fixtures",
        file(providers.gradleProperty("fixturesDir").getOrElse("src/renderTest/components")),
        layout.buildDirectory.dir("render-test/fixtures").get().asFile,
        providers.gradleProperty("overwriteFixtures").isPresent,
    )
}

val defaultsDump = layout.buildDirectory.dir("render-test/defaults/actual")
val defaultsExpected = file("src/renderTest/defaults")

val dumpDefaults by tasks.registering(Exec::class) {
    group = "render test"
    description = "Lists the state of a newly created component for each card handler."
    inputs.dir(strangeEonsRenderTest.pluginFolder)
    inputs.file(fixtureScript)
    outputs.dir(defaultsDump)
    runFixtureScript("defaults", defaultsDump.get().asFile, layout.buildDirectory.dir("render-test/defaults/work").get().asFile)
}

val verifyDefaults by tasks.registering {
    group = "verification"
    description = "Compares new-component state for each card handler with src/renderTest/defaults."
    dependsOn(dumpDefaults)
    inputs.dir(defaultsDump)
    inputs.dir(defaultsExpected)
    doLast {
        val actual = defaultsDump.get().asFile
        val names = sortedSetOf<String>().apply {
            actual.list()?.let { addAll(it) }
            defaultsExpected.list()?.let { addAll(it) }
        }
        val failures = names.mapNotNull { name ->
            val a = actual.resolve(name)
            val e = defaultsExpected.resolve(name)
            when {
                !e.exists() -> "$name: no expected file"
                !a.exists() -> "$name: not produced"
                else -> {
                    val al = a.readLines().toSet()
                    val el = e.readLines().toSet()
                    val diff = (el - al).map { "- $it" } + (al - el).map { "+ $it" }
                    if (diff.isEmpty()) null else "$name:\n  " + diff.joinToString("\n  ")
                }
            }
        }
        if (failures.isNotEmpty()) {
            throw GradleException("${failures.size} handler(s) differ:\n" + failures.joinToString("\n"))
        }
        logger.lifecycle("${names.size} handler(s) match")
    }
}

val updateDefaults by tasks.registering(Copy::class) {
    group = "render test"
    description = "Replaces src/renderTest/defaults with the current new-component state."
    dependsOn(dumpDefaults)
    from(defaultsDump)
    into(defaultsExpected)
}

tasks.named("check") { dependsOn(verifyDefaults) }
