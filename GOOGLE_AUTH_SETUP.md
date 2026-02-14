# 🔐 Snaplinq — Google Authentication Setup Guide

Complete step-by-step guide for configuring Google Sign-In across **Web**, **Android**, and **iOS**.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Part A — Google Cloud Console Setup](#2-part-a--google-cloud-console-setup)
3. [Part B — Supabase Configuration](#3-part-b--supabase-configuration)
4. [Part C — Web App (Vercel / Browser)](#4-part-c--web-app-vercel--browser)
5. [Part D — Android App](#5-part-d--android-app)
6. [Part E — iOS App](#6-part-e--ios-app)
7. [Part F — Testing Checklist](#7-part-f--testing-checklist)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:

- [ ] A **Google Account** with access to [Google Cloud Console](https://console.cloud.google.com)
- [ ] A **Supabase project** (yours is already at `ohwnivrapwxvunfmjzam.supabase.co`)
- [ ] **Node.js** (v18+) and **npm** installed
- [ ] **EAS CLI** installed globally: `npm install -g eas-cli`
- [ ] **Xcode** installed (for iOS — Mac only)
- [ ] **Android Studio** installed (for Android)
- [ ] An **Apple Developer Account** (for iOS distribution)

---

## 2. Part A — Google Cloud Console Setup

This is the **foundation** — you'll create OAuth credentials here that both Supabase and the native apps will use.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the **project dropdown** (top-left, next to "Google Cloud")
3. Click **"New Project"**
4. Enter:
   - **Project name:** `Snaplinq`
   - **Organization:** Leave as default
5. Click **"Create"**
6. Wait for creation → select your new **Snaplinq** project

### Step 2: Enable Google APIs

1. Go to **APIs & Services → Library**
2. Search for and **enable** these APIs:
   - ✅ **Google Identity Services** (or "Google Sign-In")
   - ✅ **Google People API** (optional, for profile info)

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Select **External** (available to any Google account)
3. Click **"Create"**
4. Fill in the consent screen:
   - **App name:** `Snaplinq`
   - **User support email:** Your email
   - **App logo:** Upload the Snaplinq icon (optional)
   - **App domain:** Your Vercel URL (e.g., `https://snaplinq.vercel.app`)
   - **Authorized domains:** Add `supabase.co`
   - **Developer contact email:** Your email
5. Click **"Save and Continue"**
6. **Scopes** → Click **"Add or Remove Scopes"**
   - Add: `email`, `profile`, `openid`
   - Click **"Update"** → **"Save and Continue"**
7. **Test users** → Add your Google email for testing
8. Click **"Save and Continue"** → **"Back to Dashboard"**

### Step 4: Create OAuth Client IDs

You need **3 separate OAuth Client IDs** — one for each platform.

---

#### 4a. Web Client ID

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials" → "OAuth Client ID"**
3. Application type: **Web application**
4. Name: `Snaplinq Web`
5. **Authorized JavaScript origins:**
   ```
   https://snaplinq.vercel.app
   http://localhost:8081
   http://localhost:19006
   ```
6. **Authorized redirect URIs:**
   ```
   https://ohwnivrapwxvunfmjzam.supabase.co/auth/v1/callback
   ```
   > ⚠️ This is your **Supabase callback URL**. Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`
7. Click **"Create"**
8. **Copy and save:**
   - 📋 **Client ID:** `xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`
   - 📋 **Client Secret:** `GOCSPX-xxxxxxxxxxxxxxxxxxxx`

> [!IMPORTANT]
> The **Web Client ID** is also used by the Android and iOS native SDKs — save it carefully!

---

#### 4b. Android Client ID

1. Click **"+ Create Credentials" → "OAuth Client ID"**
2. Application type: **Android**
3. Name: `Snaplinq Android`
4. **Package name:** `com.snaplinq.app`
5. **SHA-1 certificate fingerprint** — Get it by running:

   **For Debug (development):**
   ```bash
   cd ~/.android
   keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
   Copy the **SHA1** line (e.g., `AB:CD:EF:12:34:...`)

   **For Release (production) — if using EAS:**
   ```bash
   eas credentials -p android
   ```
   Select your project → view keystore → copy the SHA-1

6. Paste the SHA-1 fingerprint
7. Click **"Create"**
8. **Copy the Android Client ID** (you won't need the secret for native)

---

#### 4c. iOS Client ID

1. Click **"+ Create Credentials" → "OAuth Client ID"**
2. Application type: **iOS**
3. Name: `Snaplinq iOS`
4. **Bundle ID:** `com.snaplinq.app`
5. Click **"Create"**
6. **Copy the iOS Client ID**
7. **Download** the `GoogleService-Info.plist` file

---

### 📋 Summary of Created Credentials

After this step, you should have:

| Platform | Client ID | Extra |
|----------|-----------|-------|
| **Web** | `xxxx.apps.googleusercontent.com` | + Client Secret |
| **Android** | `xxxx.apps.googleusercontent.com` | SHA-1 linked |
| **iOS** | `xxxx.apps.googleusercontent.com` | + `GoogleService-Info.plist` |

---

## 3. Part B — Supabase Configuration

### Step 1: Add Google Provider in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **Snaplinq** project
3. Go to **Authentication → Providers**
4. Find **Google** → toggle it **ON**
5. Enter:
   - **Client ID:** Paste the **Web Client ID** from Step 4a
   - **Client Secret:** Paste the **Web Client Secret** from Step 4a
6. **Authorized Client IDs (for mobile native):**
   - Paste the **Android Client ID** from Step 4b
   - Paste the **iOS Client ID** from Step 4c
   - (Comma-separated or one per line, depending on Supabase UI)

   > [!IMPORTANT]
   > You **must** add the Android and iOS Client IDs here. Without this, Supabase will reject the `signInWithIdToken` calls from mobile apps with an "invalid token" error.

7. Click **Save**

### Step 2: Verify Redirect URL

1. In Supabase → **Authentication → URL Configuration**
2. Ensure **Site URL** is set to your production URL:
   ```
   https://snaplinq.vercel.app
   ```
3. Under **Redirect URLs**, add:
   ```
   https://snaplinq.vercel.app
   https://snaplinq.vercel.app/**
   http://localhost:8081
   http://localhost:8081/**
   http://localhost:19006
   http://localhost:19006/**
   snaplinq://
   snaplinq://**
   ```

---

## 4. Part C — Web App (Vercel / Browser)

The web app uses **Supabase OAuth redirect flow** — no native SDK needed.

### How It Works

```
User clicks "Continue with Google"
    → supabase.auth.signInWithOAuth({ provider: 'google' })
    → Browser redirects to Google consent screen
    → User grants permission
    → Google redirects to Supabase callback URL
    → Supabase creates session
    → Redirects back to your app
    → onAuthStateChange fires → user is logged in
```

### Step 1: Verify Your Code

Your `AuthContext.tsx` already handles this correctly:

```typescript
// Web: OAuth Redirect
const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
});
```

✅ **No code changes needed for web.**

### Step 2: Set Environment Variables on Vercel

1. Go to [Vercel Dashboard](https://vercel.com) → Your Snaplinq project
2. Go to **Settings → Environment Variables**
3. Ensure these are set:
   ```
   EXPO_PUBLIC_SUPABASE_URL = https://ohwnivrapwxvunfmjzam.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
   ```
4. **Redeploy** the project for changes to take effect

### Step 3: Test Web Google Sign-In

1. Open your Vercel URL (e.g., `https://snaplinq.vercel.app`)
2. Click **"Continue with Google"**
3. Select your Google account on the consent screen
4. You should be redirected back and logged in
5. Verify your name/email appears in the dashboard

---

## 5. Part D — Android App

Android uses the **native Google Sign-In SDK** via `@react-native-google-signin/google-signin`.

### Step 1: Update `AuthContext.tsx` — Set Web Client ID

Open `src/context/AuthContext.tsx` and find the `GoogleSignin.configure()` call. Update it with your **Web Client ID**:

```typescript
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',  // ← Replace this!
    offlineAccess: true,
});
```

> [!CAUTION]
> Use the **Web Client ID** here, NOT the Android Client ID. The native SDK exchanges it for an `idToken` that Supabase validates against the Web Client ID.

### Step 2: Get `google-services.json`

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** → Select your existing **Snaplinq** Google Cloud project
3. Click **"Continue"** (skip Analytics or enable it)
4. Once the project is ready, click **"Add app" → Android**
5. Enter:
   - **Package name:** `com.snaplinq.app`
   - **App nickname:** `Snaplinq Android`
   - **Debug signing certificate SHA-1:** (same SHA-1 from Step 4b)
6. Click **"Register app"**
7. **Download `google-services.json`**
8. Place it in your **project root:**
   ```
   snaplinq/
   ├── google-services.json   ← HERE
   ├── app.json
   ├── package.json
   └── ...
   ```

### Step 3: Update `app.json`

Add the Google Services file and the Google Sign-In plugin to your `app.json`:

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.snaplinq.app",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "expo-router",
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

### Step 4: Create EAS Build Configuration

1. Run:
   ```bash
   eas build:configure
   ```
   This creates `eas.json` in your project root.

2. Update `eas.json` for development:
   ```json
   {
     "cli": { "version": ">= 3.0.0" },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {}
     }
   }
   ```

### Step 5: Build the Android App

```bash
# Development build (for testing with dev client)
eas build --platform android --profile development

# OR Preview build (standalone APK for testing)
eas build --platform android --profile preview
```

> ⏳ This takes ~10-15 minutes. EAS will provide a download link when done.

### Step 6: Install and Test

1. Download the APK from the EAS build link
2. Install on your Android device or emulator
3. Open the app → Tap **"Continue with Google"**
4. The native Google Sign-In prompt should appear
5. Select your Google account
6. You should be redirected to the dashboard, logged in

> [!NOTE]
> Google Sign-In does **NOT** work in Expo Go. You **must** use a custom development build or a preview/production build.

---

## 6. Part E — iOS App

iOS also uses the **native Google Sign-In SDK**, but requires additional Apple-specific setup.

### Step 1: Get `GoogleService-Info.plist`

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open your **Snaplinq** project (same one from Android step)
3. Click **"Add app" → iOS**
4. Enter:
   - **Bundle ID:** `com.snaplinq.app`
   - **App nickname:** `Snaplinq iOS`
5. Click **"Register app"**
6. **Download `GoogleService-Info.plist`**
7. Place it in your **project root:**
   ```
   snaplinq/
   ├── GoogleService-Info.plist   ← HERE
   ├── google-services.json
   ├── app.json
   └── ...
   ```

### Step 2: Update `app.json`

Add the iOS Google Services file and URL scheme:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.snaplinq.app",
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": [
              "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_REVERSED"
            ]
          }
        ]
      }
    },
    "plugins": [
      "expo-router",
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

> [!IMPORTANT]
> Replace `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_REVERSED` with your **reversed iOS Client ID**.
>
> Example: If your iOS Client ID is `123456-abcdef.apps.googleusercontent.com`,
> the reversed version is `com.googleusercontent.apps.123456-abcdef`
>
> You can find this in `GoogleService-Info.plist` under the `REVERSED_CLIENT_ID` key.

### Step 3: Update `AuthContext.tsx` — Add iOS Client ID

```typescript
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',  // ← Add this!
    offlineAccess: true,
});
```

### Step 4: Build the iOS App

```bash
# Development build (for testing with dev client)
eas build --platform ios --profile development

# OR Preview build (for TestFlight / internal testing)
eas build --platform ios --profile preview
```

> ⏳ iOS builds take ~15-25 minutes. You'll need an Apple Developer account.

### Step 5: Install and Test

**On Simulator:**
1. Download the `.tar.gz` from EAS
2. Extract it
3. Drag the `.app` file onto the iOS Simulator

**On Physical Device:**
1. Use **TestFlight** (for preview/production profiles)
2. Or install the development build via QR code from EAS

**Test:**
1. Open the app → Tap **"Continue with Google"**
2. The native Google Sign-In sheet should appear
3. Select your Google account
4. You should land on the dashboard, logged in

---

## 7. Part F — Testing Checklist

### Web
- [ ] Navigate to your Vercel URL
- [ ] Click "Continue with Google"
- [ ] Google consent screen appears
- [ ] After sign-in, redirected back to dashboard
- [ ] User info (email/name) is accessible
- [ ] Sign out works correctly
- [ ] Sign in again works (returning user)

### Android
- [ ] Built with EAS (not Expo Go)
- [ ] `google-services.json` is in project root
- [ ] App opens without crashes
- [ ] Click "Continue with Google"
- [ ] Native Google prompt appears
- [ ] After sign-in, dashboard loads
- [ ] Links from web app appear (shared Supabase DB)
- [ ] Sign out works correctly

### iOS
- [ ] Built with EAS (not Expo Go)
- [ ] `GoogleService-Info.plist` is in project root
- [ ] `REVERSED_CLIENT_ID` is in URL schemes
- [ ] App opens without crashes
- [ ] Click "Continue with Google"
- [ ] Native Google sign-in sheet appears
- [ ] After sign-in, dashboard loads
- [ ] Links from web app appear (shared Supabase DB)
- [ ] Sign out works correctly

---

## 8. Troubleshooting

### ❌ "Error: DEVELOPER_ERROR" (Android)

**Cause:** SHA-1 mismatch between your build keystore and the one registered in Google Cloud Console.

**Fix:**
1. Get the SHA-1 from your EAS build: `eas credentials -p android`
2. Add it to your **Android OAuth Client ID** in Google Cloud Console
3. Also add it to **Firebase Console → Project Settings → Android app → Add fingerprint**
4. Rebuild

---

### ❌ "Invalid token" or "Unauthorized" (Mobile)

**Cause:** Supabase doesn't recognize the Client ID.

**Fix:**
1. Go to **Supabase → Authentication → Providers → Google**
2. Ensure the **Android Client ID** and **iOS Client ID** are listed under **"Authorized Client IDs"**
3. Ensure you're using the **Web Client ID** in `GoogleSignin.configure({ webClientId })` — not the Android/iOS one

---

### ❌ "redirect_uri_mismatch" (Web)

**Cause:** The redirect URI doesn't match what's registered in Google Cloud Console.

**Fix:**
1. Go to **Google Cloud Console → Credentials → Web Client ID → Edit**
2. Add your exact Supabase callback URL under **Authorized redirect URIs:**
   ```
   https://ohwnivrapwxvunfmjzam.supabase.co/auth/v1/callback
   ```
3. Also add your site URL under **Authorized JavaScript origins**

---

### ❌ Google Sign-In button does nothing (Expo Go)

**Cause:** Native Google Sign-In is **not supported** in Expo Go.

**Fix:** You must create a custom development build:
```bash
eas build --platform android --profile development
eas build --platform ios --profile development
```

---

### ❌ "Network error" on sign-in

**Cause:** Missing Play Services (Android emulator) or no internet.

**Fix:**
- Use an emulator image **with Google Play** (look for "Google APIs" in AVD Manager)
- Ensure your device/emulator has internet access

---

### ❌ App crashes on launch (iOS)

**Cause:** Missing or invalid `GoogleService-Info.plist`.

**Fix:**
- Verify the `Bundle ID` in the plist matches `com.snaplinq.app`
- Re-download from Firebase Console
- Rebuild with EAS

---

## 📁 Final File Placement Summary

After setup, your project root should look like this:

```
snaplinq/
├── google-services.json        ← Firebase Android config
├── GoogleService-Info.plist    ← Firebase iOS config
├── eas.json                    ← EAS Build configuration
├── app.json                    ← Updated with plugins + service files
├── .env                        ← Supabase keys
├── src/
│   └── context/
│       └── AuthContext.tsx      ← Updated with real Client IDs
└── ...
```

## 🔑 Key Reminders

| Setting | Value |
|---------|-------|
| Package / Bundle ID | `com.snaplinq.app` |
| Deep Link Scheme | `snaplinq://` |
| Supabase Callback | `https://ohwnivrapwxvunfmjzam.supabase.co/auth/v1/callback` |
| `GoogleSignin.configure()` uses | **Web Client ID** (not Android/iOS) |
| iOS additionally needs | `iosClientId` in configure + `REVERSED_CLIENT_ID` URL scheme |

---

*Last updated: February 2026*
