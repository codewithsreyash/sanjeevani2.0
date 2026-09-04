# SANJEEVANI — Android Build & Native Setup Guide

This document explains how to configure, run, and generate an installable APK for Sanjeevani using standard open-source tools without requiring paid SaaS services or hosted EAS build pipelines.

## 1. Prerequisites

- **Node.js:** v18.x or v20.x LTS
- **Java Development Kit (JDK):** JDK 17 (Recommended for React Native / Gradle)
- **Android SDK & Build Tools:** Android SDK 34+ (configured via Android Studio or command-line tools)
- **Environment Variables (`.env`):**
  ```env
  ANDROID_HOME=C:\Users\sreyash\AppData\Local\Android\Sdk
  JAVA_HOME=C:\Program Files\Java\jdk-17
  PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
  ```

---

## 2. Local Android Development

To start the Expo development server with native Android prebuilding:

```bash
cd apps/mobile

# Install dependencies
npm install

# Run prebuild to generate native android folder locally
npx expo prebuild --platform android

# Launch local Android build on connected device or emulator
npx expo run:android
```

---

## 3. Local APK Generation (Release Build)

To produce a self-contained, standalone `.apk` for judges:

```bash
cd apps/mobile/android

# Clean and build release APK using Gradle wrapper
./gradlew assembleRelease
```

The compiled APK will be located at:
`apps/mobile/android/app/build/outputs/apk/release/app-release.apk`

---

## 4. Hardware Permissions Configured in `app.json`

- **Camera (`expo-camera`):** `android.permission.CAMERA` (QR Code scanning)
- **Location (`expo-location`):** `android.permission.ACCESS_FINE_LOCATION` (Facility distance calculation)
- **Network State (`@react-native-community/netinfo`):** `android.permission.ACCESS_NETWORK_STATE` (Offline sync detection)
- **Storage:** Internal SQLite database isolation.
