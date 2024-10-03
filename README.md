# Playground React Native Expo

## Running Locally

1. Set up Android Studio:
   1. [Install Android Studio](https://developer.android.com/studio/install)
   2. [Set up Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/#set-up-android-studio)
2. Export `ANDROID_HOME`.
3. Run `pnpm install`.
4. Start your backend server.
5. Connect your Android device to your Mac.
6. Run `npx expo prebuild`.
7. Make `gradlew` executable: `chmod +x android/gradlew`.
8. Run `npx expo run:android`.
9. Find your IP address. On macOS, run `ifconfig | grep netmask` and look for the one starting with 192. To verify, open your browser and navigate to the IP address. For example, if your IP is `http://192.168.11.12`, visit `http://192.168.11.12:8080/` to ensure it returns a response.
10. Make sure you android device and laptop connected to the same wifi network.
11. Enter the function URL on your Android device. It should look like this `http://{YOUR_IP_ADDRESS}`
12. Depending on the backend toggle audio and video checkbox.
13. Click "Take Permission"
14. Click "Connect"