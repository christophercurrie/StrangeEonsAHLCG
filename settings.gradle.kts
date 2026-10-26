// Render-test build for the AHLCG plug-in. Strange Eons defaults to
// ~/Projects/strange-eons; override with -PstrangeEonsDir. Pass
// -PrenderTestPluginDir to build the render-test plug-in from a local checkout.
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
    providers.gradleProperty("renderTestPluginDir").orNull?.let { includeBuild(it) }
}

rootProject.name = "StrangeEonsAHLCG"
