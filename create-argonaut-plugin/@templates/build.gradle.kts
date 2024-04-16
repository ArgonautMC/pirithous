import com.github.jengelman.gradle.plugins.shadow.tasks.ConfigureShadowRelocation
import com.google.protobuf.gradle.id
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "kr.argonaut"
version = "1.0-SNAPSHOT"
val artifactName = "%plugin_name%"
val mcApiVersion: String by project
val simpleMcApiVersion: String by project
val pluginDirectoryPath: String by project
val legacyPluginDirectoryPath: String by project

val protobufVersion = "3.24.0"
val grpcKotlinVersion = "1.4.0"
val grpcVersion = "1.60.1"

buildscript {
    repositories {
        mavenCentral()
    }
}

plugins {
    kotlin("jvm") version "1.9.23"
    kotlin("kapt") version "1.9.23"
    id("com.github.johnrengelman.shadow") version "8.0.0"%buildscript.plugins.grpc%
}

repositories {
    mavenCentral()
    maven("https://hub.spigotmc.org/nexus/content/repositories/snapshots/")
    maven("https://oss.sonatype.org/content/repositories/snapshots")
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(kotlin("reflect"))%buildscript.dependencies.coroutine%
    implementation("io.insert-koin:koin-core:3.5.3")

    compileOnly("org.spigotmc:spigot-api:${mcApiVersion}")%buildscript.dependencies.grpc%

    testImplementation(platform("org.junit:junit-bom:5.9.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation(kotlin("test"))
}

val java17 = 17

kotlin {
    jvmToolchain(17)
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(java17))
    }
}

tasks {
    withType<JavaCompile>().configureEach {
        if (java17 >= 10 || JavaVersion.current().isJava10Compatible()) {
            options.release.set(java17)
        }
    }

    withType<KotlinCompile>().configureEach {
        kotlinOptions.jvmTarget = java17.toString()
    }

    processResources {
        val placeholders = mapOf(
            "version" to version,
            "apiVersion" to simpleMcApiVersion,
            "kotlinVersion" to project.properties["kotlinVersion"]
        )

        require(placeholders.values.all { it !== null }) {
            "please enter placeholders to gradle.properties"
        }

        filesMatching("plugin.yml") {
            expand(placeholders)
        }
    }

    val configureShadowRelocation by registering(ConfigureShadowRelocation::class) {
        target = shadowJar.get()
        prefix = "${project.group}.${project.name.lowercase()}.libraries"
    }

    shadowJar {
        mergeServiceFiles {
            relocate("io.grpc", "shaded.io.grpc")
            relocate("io.perfmark", "shaded.io.perfmark")
            relocate("com.google", "shaded.com.google")
            relocate("android.annotation", "shaded.android.annotation")
            relocate("javax.annotation", "shaded.javax.annotation")
            relocate("kotlin", "shaded.kotlin")
            relocate("kotlinx.coroutines", "shaded.kotlinx.coroutines")
            relocate("org.checkerframework", "shaded.org.checkerframework")
            relocate("org.codehaus", "shaded.org.codehaus")
            relocate("org.intellij", "shaded.org.intellij")
            relocate("org.jetbrains", "shaded.org.jetbrains")
            relocate("org.koin", "shaded.org.koin")
        }
    }

    test {
        useJUnitPlatform()
    }%buildscript.tasks.grpc%
}
