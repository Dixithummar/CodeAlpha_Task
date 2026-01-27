# 🚀 Quick Start Guide - WA Bulk Sender

Get up and running with **WA Bulk Sender** in 5 minutes!

## 📱 Mobile App Setup

### Step 1: Install Dependencies

```bash
cd wa-bulk-sender
npm install
```

### Step 2: Start Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

### Step 3: Run on Device

**Option A: Physical Device (Recommended)**
1. Install **Expo Go** app from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)
2. Scan the QR code from Expo DevTools
3. App will load on your device

**Option B: Android Emulator**
```bash
npm run android
```

**Option C: iOS Simulator (macOS only)**
```bash
npm run ios
```

### Step 4: Test the App

1. **Import Sample Contacts**
   - Go to **Contacts** tab
   - Tap **Import**
   - Select `sample-contacts.csv`
   - Map columns: Name → Name, Phone → Phone
   - Tap **Import**

2. **Create Message**
   - Go to **Message** tab
   - Enter: `Hi {name}! This is a test message.`
   - See live preview

3. **Send Test Message**
   - Tap **Send to Next Contact**
   - WhatsApp opens with pre-filled message
   - Press SEND in WhatsApp
   - Return to app to see log

## 🖥️ Backend Setup (Optional)

### Step 1: Install Dependencies

```bash
cd wa-bulk-sender-backend
npm install
```

### Step 2: Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

### Step 3: Setup Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Start Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Step 5: Test API

```bash
# Health check
curl http://localhost:3000/health

# Get contacts
curl http://localhost:3000/api/contacts -H "x-user-id: test"
```

## 📦 Build APK (Production)

### Quick Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build APK
cd wa-bulk-sender
eas build --platform android --profile preview
```

Wait 5-10 minutes, then download APK from the link provided.

## 🎯 Usage Flow

### 1️⃣ Import Contacts

**CSV Format:**
```csv
Name,Phone,Company,Email
John Doe,+1234567890,Acme Inc,john@example.com
Jane Smith,+0987654321,Tech Corp,jane@example.com
```

**Steps:**
1. Contacts tab → Import
2. Select CSV/XLSX file
3. Map Name and Phone columns
4. Preview and confirm

### 2️⃣ Create Message

**Template Example:**
```
Hi {name}! 👋

I hope you're doing well.

I noticed you work at {col3}. 
Would love to connect!

Best regards
```

**Placeholders:**
- `{name}` - Contact name
- `{phone}` - Phone number
- `{col1}`, `{col2}`, `{col3}` - CSV columns

### 3️⃣ Configure Settings

**Auto Send:**
- Enable for automatic flow
- Set delay (2-10 seconds)
- App opens WhatsApp automatically

**Manual Mode:**
- Disable auto send
- More control over each message
- Send one at a time

### 4️⃣ Send Messages

**Auto Send Flow:**
1. Message tab → Enable Auto Send
2. Set delay to 5 seconds
3. Tap "Send to All"
4. App opens WhatsApp for each contact
5. Manually press SEND in WhatsApp
6. App waits 5s and continues

**Manual Flow:**
1. Message tab → Disable Auto Send
2. Tap "Send to Next Contact"
3. WhatsApp opens
4. Press SEND
5. Return to app
6. Repeat

### 5️⃣ Track & Retry

**View Logs:**
1. Logs tab → See all activity
2. Filter by Success/Errors
3. View timestamps and details

**Retry Failed:**
1. Logs tab → Retry Failed button
2. App resends to all failed contacts
3. Check logs again

## 🎨 Customization

### Change Theme Colors

Edit `utils/constants.ts`:
```typescript
export const COLORS = {
  primary: '#25D366',  // Change to your color
  // ... other colors
};
```

### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Add Custom Placeholders

Edit `utils/messageParser.ts` to add custom logic.

## 🔧 Troubleshooting

### App won't start
```bash
# Clear cache
cd wa-bulk-sender
rm -rf node_modules
npm install
npm start -- --clear
```

### WhatsApp not opening
- Ensure WhatsApp is installed
- Check phone number format (+1234567890)
- Verify internet connection

### Import not working
- Check CSV format (comma-separated)
- Ensure headers in first row
- Try with sample-contacts.csv first

### Backend errors
```bash
# Reset database
cd wa-bulk-sender-backend
npx prisma migrate reset
npm run dev
```

## 📚 Next Steps

1. **Read Full Documentation**
   - `README.md` - Complete app guide
   - `DEPLOYMENT.md` - Production deployment
   - `PROJECT_OVERVIEW.md` - Technical details

2. **Customize the App**
   - Change colors and branding
   - Add custom features
   - Modify message templates

3. **Deploy to Production**
   - Build APK for Android
   - Deploy backend to Railway/Render
   - Distribute to users

4. **Get Support**
   - Check documentation
   - Open GitHub issue
   - Review troubleshooting guide

## ⚡ Pro Tips

1. **Test with small batches first** (5-10 contacts)
2. **Use realistic delays** (5+ seconds) to avoid WhatsApp rate limits
3. **Always get consent** before sending bulk messages
4. **Keep messages personal** - use placeholders effectively
5. **Monitor logs** - retry failed messages promptly
6. **Backup contacts** - export CSV regularly
7. **Use dark mode** - easier on the eyes
8. **Enable auto-send** - for faster workflow

## 🎉 You're Ready!

Your WA Bulk Sender app is now set up and ready to use!

**Remember:**
- ✅ This app uses WhatsApp deep links (legal)
- ✅ You must manually press SEND (required)
- ✅ Respect privacy laws and get consent
- ✅ Use responsibly and ethically

**Happy messaging! 💬**

---

Need help? Check the full documentation or open an issue on GitHub.
