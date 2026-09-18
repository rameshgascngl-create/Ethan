plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.gasczoology.varugai"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.gasczoology.varugai"
        minSdk = 24
        targetSdk = 36
        versionCode = 15101
        versionName = "15.1.1"
    }

    val releaseStore = System.getenv("VARUGAI_KEYSTORE_FILE")
    val releaseStorePassword = System.getenv("VARUGAI_KEYSTORE_PASSWORD")
    val releaseAlias = System.getenv("VARUGAI_KEY_ALIAS")
    val releaseKeyPassword = System.getenv("VARUGAI_KEY_PASSWORD")

    val releaseSigning = if (
        !releaseStore.isNullOrBlank() &&
        !releaseStorePassword.isNullOrBlank() &&
        !releaseAlias.isNullOrBlank() &&
        !releaseKeyPassword.isNullOrBlank()
    ) {
        signingConfigs.create("release") {
            storeFile = file(releaseStore)
            storePassword = releaseStorePassword
            keyAlias = releaseAlias
            keyPassword = releaseKeyPassword
            enableV1Signing = true
            enableV2Signing = true
            enableV3Signing = true
            enableV4Signing = true
        }
    } else null

    buildTypes {
        getByName("release") {
            isMinifyEnabled = true
            isShrinkResources = true
            releaseSigning?.let { signingConfig = it }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        getByName("debug") {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    buildFeatures {
        buildConfig = true
    }

    androidResources {
        noCompress += listOf("html")
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.activity:activity-ktx:1.9.0")
    implementation("androidx.webkit:webkit:1.11.0")
}
