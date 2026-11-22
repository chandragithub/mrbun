# Mr Bun - Android Mobile App & Google Play Store Deployment Guide

This document explains how the **Mr Bun Android Mobile Application** works, how it stays continuously in sync with the web app, how to build APKs for testing, and the complete step-by-step process for deploying the app to the **Google Play Store**.

---

## 1. Architecture & Continuous Web-to-Android Sync

The Android app is built as an exact replica of the Mr Bun web app using **Capacitor**. 
All native Android files are located inside the `android/` directory.

### Zero-Touch Auto-Sync:
Whenever you make any change to the web app and build it, the Android app is **automatically updated**:

```bash
npm run build
```
This single command:
1. Compiles TypeScript and packages optimized web assets with Vite into `dist/`.
2. Automatically copies all web assets (HTML, CSS, JavaScript, images, and config) directly into `android/app/src/main/assets/public/`.
3. Ensures the native Android project is in 100% sync at all times.

### Additional Helper Commands:
- `npm run sync:android` — Force sync web assets and plugin configurations to Android.
- `npm run open:android` — Opens the `android/` project directly in **Android Studio**.

---

## 2. Zoom Prevention (Built-in)

The mobile app has zoom controls and pinch-to-zoom completely disabled via 3 complementary layers:
1. **Native Android WebView Layer (`android/app/src/main/java/com/mrbun/app/MainActivity.java`)**:
   - `settings.setSupportZoom(false)`
   - `settings.setBuiltInZoomControls(false)`
   - `settings.setDisplayZoomControls(false)`
2. **HTML Viewport Layer (`index.html`)**:
   - `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />`
3. **CSS Touch Manipulation Layer (`src/index.css`)**:
   - `touch-action: manipulation;` preventing double-tap to zoom.

---

## 3. Local Testing & Generating Debug APK

You can build and test an APK immediately on any physical Android device or emulator:

### Method A: Using Android Studio (Recommended)
1. Open Android Studio.
2. Select **Open an Existing Project** and choose the `/Users/chandrashekherpolimera/Projects/mrbun/android` folder.
3. Wait for Gradle to sync dependencies.
4. Connect an Android phone (with USB Debugging enabled) or start an Android Emulator.
5. Click the green **Run ▶** button.

### Method B: Via Command Line
Inside the project root:
```bash
npm run build
cd android
./gradlew assembleDebug
```
The output APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

Transfer this file to your Android phone to install and test directly.

---

## 4. Google Play Store Deployment (Step-by-Step)

Google Play Store requires an **Android App Bundle (`.aab`)** signed with a production release key.

### Step 1: Create a Google Play Console Developer Account
1. Visit [Google Play Console](https://play.google.com/console/signup).
2. Sign in with your Google account.
3. Pay the one-time registration fee ($25 USD).
4. Complete your developer identity verification (ID proof, address proof).

---

### Step 2: Generate a Release Keystore
To sign your app for production, create a private signing key (do this once and **store it securely**):

Run the following command in terminal:
```bash
keytool -genkey -v -keystore mrbun-release-key.jks -alias mrbun -keyalg RSA -keysize 2048 -validity 10000
```
- You will be prompted to enter a password and your business details (e.g. Ceansys Technologies / Mr Bun).
- Keep `mrbun-release-key.jks` and your passwords safe. **Do NOT commit this `.jks` file to public GitHub**.

---

### Step 3: Build the Signed Android App Bundle (.aab)

#### Option 1: Via Android Studio (Simplest)
1. In Android Studio, open the `android/` project.
2. From top menu, click **Build** > **Generate Signed Bundle / APK...**
3. Select **Android App Bundle** and click **Next**.
4. Point **Key store path** to your `mrbun-release-key.jks`, enter your passwords and alias (`mrbun`).
5. Choose destination folder, select **release**, and click **Finish**.
6. Android Studio will output the signed bundle file: `app-release.aab`.

#### Option 2: Via Gradle CLI
Add your keystore credentials in `android/gradle.properties`:
```properties
RELEASE_STORE_FILE=../mrbun-release-key.jks
RELEASE_STORE_PASSWORD=your_keystore_password
RELEASE_KEY_ALIAS=mrbun
RELEASE_KEY_PASSWORD=your_key_password
```
And build via terminal:
```bash
cd android
./gradlew bundleRelease
```
The generated bundle will be located at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

### Step 4: Create the App in Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**.
3. Fill in the basic details:
   - **App name**: `Mr Bun`
   - **Default language**: English (United States or India)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept the declarations and click **Create app**.

---

### Step 5: Complete the Store Presence & Details
Navigate to **Grow** > **Store presence** > **Main store listing**:
- **App name**: `Mr Bun`
- **Short description** (Up to 80 characters):
  > *Fresh cheesy pizzas, juicy burgers, artisan mocktails & party packages delivered hot.*
- **Full description** (Up to 4000 characters):
  > *Welcome to Mr Bun! Order delicious handcrafted burgers, oven-fresh cheese burst pizzas, sizzling grilled sandwiches, and ice-cold artisan mocktails right to your doorstep. Powered by Ceansys Technologies, Mr Bun offers instant online ordering, table reservations, and party catering packages with fast delivery and live kitchen tracking. Contact: 9476088111.*
- **App Icon**: 512 x 512 px PNG (32-bit color, max 1MB). You can use `/public/logo.png`.
- **Feature Graphic**: 1024 x 500 px JPG or PNG.
- **Screenshots**: At least 2 phone screenshots (e.g. 1080 x 1920 or 1080 x 2400) showing the Menu, Party Packages, and Checkout.

---

### Step 6: Complete Policy & Compliance Declarations
In Google Play Console, go to **Policy** > **App content**:
1. **Privacy Policy**: Provide the URL to your live policy:
   `https://mrbun.ceansystech.workers.dev/terms`
2. **Refund & Cancellation Policy**: Link to:
   `https://mrbun.ceansystech.workers.dev/refunds`
3. **App Access**: Select *"All functionality is available without special access"* or provide test login credentials (e.g. Test phone `9476088111` with OTP `1234`).
4. **Ads**: Select *"No, my app does not contain ads"*.
5. **Content Rating**: Complete the IARC questionnaire. Category: Food & Drink / Shopping (result will be General / 3+).
6. **Target Audience**: Select **18 and above**.
7. **Financial Features**: Select *"No financial features"* (standard e-commerce food checkout).

---

### Step 7: Create Production Release & Upload .aab
1. In Google Play Console, navigate to **Release** > **Production** (or **Internal testing** first to test on your own device).
2. Click **Create new release**.
3. Under **App bundles**, upload the `app-release.aab` file created in Step 3.
4. Enter **Release name** (e.g., `1.0.0 (1)`).
5. Enter **Release notes**:
   > *Initial launch of Mr Bun mobile ordering app. Enjoy fresh burgers, pizzas, artisan drinks, and party packages!*
6. Click **Next**, review any warnings, and click **Save**.
7. Click **Send for review** (or **Start rollout to Production**).

Google typically reviews and approves apps within **24 to 72 hours**. Once approved, your Mr Bun app will be live and downloadable on the Google Play Store!
