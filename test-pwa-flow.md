# PWA Authentication Flow Test Guide

## Test Scenario: PWA Home Screen Launch

### Prerequisites

- Android device with Chrome browser
- iOS device with Safari browser (optional)

### Test Steps

#### 1. Install PWA on Android

1. Open Chrome browser on Android device
2. Navigate to the Sozu Cash app URL
3. Look for "Add to Home Screen" prompt
4. Tap "Add" to install the PWA
5. Verify the app icon appears on home screen

#### 2. Test Home Screen Launch

1. Close all browser tabs/windows
2. Tap the Sozu Cash app icon on home screen
3. **Expected Result**: App opens directly to authentication screen (`/app`)
4. **Not Expected**: App opens to landing page (`/`)

#### 3. Test Authentication Flow

1. On the authentication screen, tap "Unlock with Passkeys"
2. **Expected Result**:
   - Loading spinner appears for 2 seconds
   - User is redirected to `/cash` (main wallet interface)
   - Authentication state is stored locally

#### 4. Test Session Management

1. After successful authentication, close the app
2. Reopen the app from home screen
3. **Expected Result**: User is automatically redirected to `/cash` (no re-authentication needed)

#### 5. Test Session Timeout

1. After authentication, leave the app inactive for 60+ seconds
2. **Expected Result**: User is automatically logged out and redirected to `/app`

#### 6. Test Manual Logout

1. In the wallet interface, tap the lock button (top-left on mobile)
2. **Expected Result**: User is logged out and redirected to `/app`

### Verification Points

#### PWA Manifest

- ✅ `start_url` is set to `/app`
- ✅ App opens to authentication screen when launched from home screen
- ✅ Proper icons and metadata configured

#### Authentication Context

- ✅ Authentication state persists across app sessions
- ✅ 24-hour session expiration works
- ✅ Logout functionality works
- ✅ Session timeout works

#### Navigation Flow

- ✅ `/app` → Authentication screen
- ✅ `/cash` → Main wallet interface (requires authentication)
- ✅ Unauthenticated users redirected to `/app`

### Troubleshooting

#### Issue: App opens to landing page instead of auth screen

**Solution**: Check that `public/manifest.json` has `"start_url": "/app"`

#### Issue: Authentication state not persisting

**Solution**: Check browser localStorage for `sozu-cash-auth` key

#### Issue: Session timeout not working

**Solution**: Verify `useSessionTimeout` hook is properly integrated

#### Issue: PWA not installing

**Solution**:

- Ensure HTTPS is enabled
- Check that manifest.json is accessible
- Verify service worker is registered

### Browser Compatibility

#### Android

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Samsung Internet

#### iOS

- ✅ Safari (required for PWA installation)
- ⚠️ Chrome (PWA installation not supported)

### Notes

- PWA installation requires HTTPS in production
- Service worker must be registered for offline functionality
- Authentication state is stored in localStorage (not secure for production)
- Consider implementing secure storage for production use
