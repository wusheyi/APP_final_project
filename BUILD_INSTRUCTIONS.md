# Build Instructions for Android APK

This project is configured to use **EAS Build** (Expo Application Services) to generate an APK file.

## Prerequisites

1.  **Expo Account**: You need an account at [expo.dev](https://expo.dev/signup).
2.  **EAS CLI**: The build command will use `npx eas-cli`, so no global installation is strictly necessary, but you can install it globally with `npm install -g eas-cli`.

## Steps to Build APK

1.  **Login to EAS** (if not already logged in):
    ```powershell
    npx eas login
    ```

2.  **Run the Build Command**:
    ```powershell
    npx eas build --platform android --profile preview
    ```

3.  **Wait for Build**:
    The command will upload your project to Expo's build servers. Once complete, it will provide a direct download link for the `.apk` file.

## Troubleshooting

-   **"android.package" missing**: I have already added `"package": "com.wusheyi.appfinalproject"` to your `app.json`. You can change this if you want a different package name.
-   **Credentials**: EAS will ask to generate a Keystore for you. Select "Yes" to all prompts to let EAS handle signing credentials automatically.
