# ViralDrop Production Readiness Plan

This plan outlines the steps required to transition the ViralDrop app from a functional prototype to a production-ready Android application.

## User Review Required

> [!IMPORTANT]
> **Firebase Configuration**: The project currently uses mock credentials. You will need to provide your actual `google-services.json` and Firebase console API keys for the production build to function.

> [!WARNING]
> **Package Name Change**: I will be changing the Android Package ID to `com.viraldrop.app` to match the Capacitor config. If you have already registered the app in the Firebase console as `com.gag9.app`, you will need to update it there as well.

## Proposed Changes

### [Core] Infrastructure & Security

#### [MODIFY] [capacitor.config.json](file:///C:/Users/Under/OneDrive/Desktop/Viraldrop/capacitor.config.json)
- Ensure appId is consistently `com.viraldrop.app`.

#### [MODIFY] [build.gradle](file:///C:/Users/Under/OneDrive/Desktop/Viraldrop/android/app/build.gradle)
- Update `applicationId` to `com.viraldrop.app`.
- Update `namespace` to `com.viraldrop.app`.
- Enable `minifyEnabled true` for release builds.

---

### [Feature] Media Uploads
Currently, users can only paste URLs. We need to allow them to upload images directly from their device.

#### [NEW] [storageAdapter.js](file:///C:/Users/Under/OneDrive/Desktop/Viraldrop/src/services/backend/storageAdapter.js)
- Implement Firebase Storage upload logic.
- Handle image compression before upload.

#### [MODIFY] [UploadModal.jsx](file:///C:/Users/Under/OneDrive/Desktop/Viraldrop/src/components/UploadModal.jsx)
- Add a file input or "Select Image" button.
- Integrate with `storageAdapter` to upload the file and get a permanent URL.

---

### [UX] Native Android Experience

#### [MODIFY] [App.jsx](file:///C:/Users/Under/OneDrive/Desktop/Viraldrop/src/App.jsx)
- Integrate Capacitor App plugin to handle the hardware back button.
- Logic: If a modal is open, close it. If on a sub-category, return to "Hot". Otherwise, exit app.

---

### [Branding] Assets & Icons
- Note: Use `npx @capacitor/assets generate` to create production icons and splash screens from a single source image (e.g., `assets/logo.png`).

## Verification Plan

### Automated Tests
- I will verify the build configuration by running a dry-run of the Gradle build.

### Manual Verification
- Test the back-button behavior on the Android emulator.
- Verify the Firestore security rules against the new package name.
- Test the media upload flow with a mock blob.
