# Google Sign-In Setup

The login screen uses [`expo-auth-session/providers/google`](https://docs.expo.dev/guides/google-authentication/) and reads three client IDs from environment variables. If they are missing, the **Continue with Google** button shows an inline error instead of crashing.

This guide walks you through creating the credentials, then plugging them in.

---

## 1. Create a Google Cloud project

1. Open https://console.cloud.google.com/
2. Top-left dropdown → **New Project** → name it (e.g. `Edu-Ride`) → **Create**.
3. Make sure the new project is selected.

## 2. Configure the OAuth consent screen

1. **APIs & Services → OAuth consent screen**
2. User type: **External** → **Create**
3. Fill in:
   - **App name**: Edu-Ride
   - **User support email**: your email
   - **Developer contact**: your email
4. **Scopes** step: click **Add or Remove Scopes**, tick `openid`, `email`, `profile` → **Update** → **Save and Continue**.
5. **Test users** step: add your own Google address (and any teammates' addresses) while the app is in *Testing* mode. Without this, only verified production apps can sign in.
6. Save.

## 3. Create the OAuth client IDs

Go to **APIs & Services → Credentials → + Create Credentials → OAuth client ID** and repeat for each of the three platforms below.

### 3a. Web client (required — also used for Expo Go dev)

- **Application type**: Web application
- **Name**: Edu-Ride Web
- **Authorized redirect URIs** — add all of these:
  - `https://auth.expo.io/@YOUR_EXPO_USERNAME/mobile`
    (run `npx expo whoami` to get your username; `mobile` is the slug from `app.json`)
  - `http://localhost:8081`
  - `http://localhost:19006`
- Click **Create**, copy the **Client ID** (looks like `1234-abcd.apps.googleusercontent.com`).

### 3b. iOS client (required for iOS standalone / dev-client builds)

- **Application type**: iOS
- **Name**: Edu-Ride iOS
- **Bundle ID**: must match `ios.bundleIdentifier` in `app.json` (add one if missing — e.g. `com.eduride.mobile`)
- **Create** → copy the **Client ID**.

### 3c. Android client (required for Android standalone / dev-client builds)

- **Application type**: Android
- **Name**: Edu-Ride Android
- **Package name**: must match `android.package` in `app.json` (e.g. `com.eduride.mobile`)
- **SHA-1 certificate fingerprint**:
  - **Dev (debug keystore)**: run
    ```
    keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android
    ```
    On Windows the debug keystore lives at `%USERPROFILE%\.android\debug.keystore`.
  - **Production**: get it from `eas credentials` or your release keystore.
- **Create** → copy the **Client ID**.

## 4. Plug the IDs into `.env`

1. From the `mobile/` folder:
   ```bash
   cp .env.example .env
   ```
2. Edit `mobile/.env` and paste each ID:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1234-abcd.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=1234-efgh.apps.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=1234-ijkl.apps.googleusercontent.com
   ```
3. **Restart Expo** (`Ctrl+C` then `npm run web` / `npm run android` / `npm run ios`). `EXPO_PUBLIC_*` vars are inlined at bundle time, so a hot reload won't pick them up.

## 5. What works where

| Environment | Required IDs | Notes |
| --- | --- | --- |
| `npm run web` | Web | Add `http://localhost:8081` (or whatever port Expo prints) to the Web client's redirect URIs. |
| Expo Go (Android/iOS) | Web | Uses the Expo auth proxy; that's why `https://auth.expo.io/@user/mobile` is in the redirect URIs. |
| Dev client / standalone iOS | iOS | Bundle ID in Google Console must match `app.json`. |
| Dev client / standalone Android | Android | Package name + SHA-1 must match. |

## 6. Troubleshooting

- **`Error 401: invalid_client`** — the client ID isn't recognized. Either the env var is empty / still a placeholder, or you copied it from the wrong project.
- **`redirect_uri_mismatch`** — Google rejected the callback URL. Add the exact URL it shows to the Web client's **Authorized redirect URIs**.
- **`Access blocked: This app's request is invalid`** — the bundle ID / package name on the OAuth client doesn't match `app.json`, or the SHA-1 fingerprint is wrong for Android.
- **Sign-in works once then fails** — your account is not on the **Test users** list. Add it under OAuth consent screen → Test users.

## 7. Wiring to the backend (Phase 2)

`handleGoogleAuthSuccess` in [`app/login/login.jsx`](app/login/login.jsx) currently fetches the user profile from Google directly and routes to `/driver`. When the real backend is reconnected, replace that block with a call to your backend:

```js
const payload = await apiFetch("/auth/google", {
  method: "POST",
  body: JSON.stringify({ idToken: authentication.idToken }),
});
// payload.user.role decides the route, same as the email/password path.
```

The backend then verifies the ID token with Google, creates/looks up the user, and returns the session.
