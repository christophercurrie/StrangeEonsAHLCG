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
    components = file("src/renderTest/components")
    // high-res templates; catches sub-pixel layout shifts
    resolution = 300
}

// Writes .eon fixtures with the current plug-in. Existing fixtures are kept
// unless -PoverwriteFixtures is set, since they also guard save compatibility.
val generateFixtures by tasks.registering(Exec::class) {
    group = "render test"
    description = "Creates the render-test .eon fixtures with Strange Eons."
    val buildSe = tasks.named<BuildStrangeEons>("buildStrangeEons")
    val pack = tasks.named<PackagePluginFolder>("packagePluginFolder")
    dependsOn(buildSe, pack)
    val launcher = strangeEonsRenderTest.launcher
    val script = file("src/renderTest/generate-fixtures.js")
    val out = file("src/renderTest/components")
    val work = layout.buildDirectory.dir("render-test/fixtures").get().asFile
    val overwrite = providers.gradleProperty("overwriteFixtures").isPresent
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
            "-Dfx.out=${out.absolutePath}",
            "-Dfx.results=${work.resolve("results.txt").absolutePath}",
            "-Dfx.overwrite=$overwrite",
            "-cp", cp,
            "ca.cgjennings.apps.arkham.StrangeEons",
            "--xDisableJreCheck", "--xDisablePluginLoading",
            "--glang", "en", "--ulang", "en",
            "--plugintest", pack.get().bundle.get().asFile.absolutePath,
            "--run", script.absolutePath,
        )
    }
    doLast {
        val results = work.resolve("results.txt")
        if (!results.exists() || results.readLines().lastOrNull() != "DONE") {
            throw GradleException("Fixture script stopped early. See $results")
        }
        val failed = results.readLines().filter { it.startsWith("FAIL") }
        results.readLines().filter { it != "DONE" }.forEach { logger.lifecycle(it) }
        if (failed.isNotEmpty()) throw GradleException("${failed.size} fixture(s) failed")
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
