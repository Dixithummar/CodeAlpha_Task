# Deployment Guide 🚀

Complete guide to build and deploy **WA Bulk Sender** mobile app.

## Table of Contents

1. [Android APK Build](#android-apk-build)
2. [iOS IPA Build](#ios-ipa-build)
3. [Backend Deployment](#backend-deployment)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

## Android APK Build

### Method 1: EAS Build (Recommended)

**Prerequisites:**
- Expo account (free)
- EAS CLI installed

**Steps:**

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure EAS**
```bash
cd wa-bulk-sender
eas build:configure
```

4. **Create eas.json** (if not created automatically)
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

5. **Build APK**
```bash
eas build --platform android --profile preview
```

6. **Download APK**
- Wait for build to complete (5-10 minutes)
- Download APK from provided link
- Install on Android device

### Method 2: Local Build

**Prerequisites:**
- Android Studio installed
- Java JDK 11+ installed
- Android SDK configured

**Steps:**

1. **Install dependencies**
```bash
cd wa-bulk-sender
npm install
```

2. **Generate Android project**
```bash
npx expo prebuild --platform android
```

3. **Build APK**
```bash
cd android
./gradlew assembleRelease
```

4. **Find APK**
```
android/app/build/outputs/apk/release/app-release.apk
```

## iOS IPA Build

**Prerequisites:**
- macOS with Xcode installed
- Apple Developer account ($99/year)
- EAS CLI installed

**Steps:**

1. **Configure EAS**
```bash
eas build:configure
```

2. **Build IPA**
```bash
eas build --platform ios --profile preview
```

3. **Download IPA**
- Wait for build to complete
- Download IPA from provided link
- Install via TestFlight or direct installation

## Backend Deployment

### Railway (Free Tier)

**Steps:**

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Navigate to backend**
```bash
cd wa-bulk-sender-backend
```

4. **Initialize project**
```bash
railway init
```

5. **Deploy**
```bash
railway up
```

6. **Set environment variables**
```bash
railway variables set DATABASE_URL="file:./prod.db"
railway variables set NODE_ENV="production"
railway variables set PORT="3000"
```

7. **Get deployment URL**
```bash
railway domain
```

### Render (Free Tier)

**Steps:**

1. **Create account** at https://render.com

2. **Create new Web Service**
   - Click "New +" → "Web Service"
   - Connect Git repository or upload code

3. **Configure service**
   - **Name**: wa-bulk-sender-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build && npm run prisma:generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add environment variables**
   - `DATABASE_URL` = `file:./prod.db`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `ALLOWED_ORIGINS` = `*`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

6. **Get URL**
   - Copy the `.onrender.com` URL

### Fly.io (Free Tier)

**Steps:**

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**
```bash
fly auth login
```

3. **Navigate to backend**
```bash
cd wa-bulk-sender-backend
```

4. **Create fly.toml**
```toml
app = "wa-bulk-sender-backend"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

5. **Launch app**
```bash
fly launch
```

6. **Set secrets**
```bash
fly secrets set DATABASE_URL="file:./prod.db"
```

7. **Deploy**
```bash
fly deploy
```

## Testing

### Test APK on Android

1. **Enable Unknown Sources**
   - Settings → Security → Unknown Sources → Enable

2. **Install APK**
   - Transfer APK to device
   - Tap to install
   - Grant permissions

3. **Test features**
   - Import sample CSV
   - Create message template
   - Send test message
   - Check logs

### Test Backend

1. **Health check**
```bash
curl https://your-backend-url.com/health
```

2. **Test contacts endpoint**
```bash
curl -X GET https://your-backend-url.com/api/contacts \
  -H "x-user-id: test-device"
```

3. **Create contact**
```bash
curl -X POST https://your-backend-url.com/api/contacts \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-device" \
  -d '{"name":"Test User","phone":"+1234567890"}'
```

## Troubleshooting

### Build Errors

**Error: "Expo account required"**
```bash
eas login
```

**Error: "Android SDK not found"**
- Install Android Studio
- Set ANDROID_HOME environment variable

**Error: "Gradle build failed"**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### Deployment Errors

**Error: "Database locked"**
- Use PostgreSQL instead of SQLite for production
- Update DATABASE_URL in environment variables

**Error: "Port already in use"**
- Change PORT in environment variables
- Restart service

**Error: "CORS error"**
- Add your app URL to ALLOWED_ORIGINS
- Restart backend

### App Errors

**Error: "WhatsApp not opening"**
- Ensure WhatsApp is installed
- Check phone number format
- Verify internet connection

**Error: "Import failed"**
- Check CSV format
- Ensure file is not corrupted
- Try smaller file first

**Error: "Storage error"**
- Clear app data
- Reinstall app
- Check device storage

## Production Checklist

### Before Release

- [ ] Test all features thoroughly
- [ ] Test on multiple devices
- [ ] Test with real phone numbers
- [ ] Verify WhatsApp integration
- [ ] Test import with large CSV files
- [ ] Test dark mode
- [ ] Test auto-send with delays
- [ ] Verify logs and retry functionality
- [ ] Test backend sync (if using)
- [ ] Check app permissions
- [ ] Review privacy policy
- [ ] Review terms of service

### Security

- [ ] Add API key authentication to backend
- [ ] Use HTTPS for backend
- [ ] Validate all user inputs
- [ ] Sanitize phone numbers
- [ ] Implement rate limiting
- [ ] Add error logging
- [ ] Set up monitoring

### Performance

- [ ] Optimize image assets
- [ ] Minimize app size
- [ ] Test with 1000+ contacts
- [ ] Test with slow internet
- [ ] Profile memory usage
- [ ] Test battery consumption

## Distribution

### Google Play Store

1. Create Google Play Developer account ($25 one-time)
2. Build signed AAB (App Bundle)
3. Create store listing
4. Upload AAB
5. Submit for review

### Apple App Store

1. Create Apple Developer account ($99/year)
2. Build signed IPA
3. Create App Store listing
4. Upload via Xcode or Transporter
5. Submit for review

### Direct Distribution

1. Build APK
2. Host on website or GitHub releases
3. Share download link
4. Users install via "Unknown Sources"

## Monitoring

### Backend Monitoring

**Uptime monitoring:**
- Use UptimeRobot (free)
- Monitor `/health` endpoint

**Error tracking:**
- Use Sentry (free tier)
- Track API errors

**Analytics:**
- Use Plausible (privacy-friendly)
- Track API usage

### App Monitoring

**Crash reporting:**
- Use Expo's built-in crash reporting
- Or integrate Sentry

**Analytics:**
- Use Expo Analytics (privacy-friendly)
- Track feature usage

## Updates

### OTA Updates (Expo)

```bash
# Publish update
eas update --branch production --message "Bug fixes"
```

### App Store Updates

1. Increment version in app.json
2. Build new APK/IPA
3. Upload to stores
4. Submit for review

## Support

For deployment issues:
- Check Expo documentation: https://docs.expo.dev
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- Fly.io docs: https://fly.io/docs

---

**Good luck with your deployment! 🚀**
