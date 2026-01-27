# WA Bulk Sender 📱💬

A **production-ready** bulk WhatsApp messenger mobile application with WhatsApp-style UI. Send personalized messages to multiple contacts using WhatsApp deep links - **100% FREE** and **legally compliant**.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

### Core Functionality
- 📊 **Dashboard** - Real-time stats and progress tracking
- 👥 **Contact Management** - Import from CSV/XLSX, add manually, edit, delete
- 💬 **Message Composer** - Template editor with placeholder support
- 📋 **Activity Logs** - Track success/errors with retry capability
- ⚙️ **Settings** - Dark mode, auto-send, country code configuration

### Advanced Features
- 🔄 **Auto-Send System** - Configurable delays (2-10 seconds)
- 🎯 **Personalization** - Use `{name}`, `{phone}`, `{col1}`, `{col2}` placeholders
- 📥 **Import Contacts** - CSV/XLSX with column mapping
- 🔁 **Retry Failed** - Automatically retry failed messages
- 🌙 **Dark Mode** - Beautiful WhatsApp-inspired dark theme
- 💾 **Local Storage** - All data stored locally with AsyncStorage
- 🔒 **Privacy First** - No data sent to external servers

### Legal Compliance
✅ **NO WhatsApp automation** - Uses official deep links only  
✅ **Manual send required** - User must press SEND in WhatsApp  
✅ **Terms of Service compliant** - No risk of account ban  
✅ **Privacy focused** - All data stays on device  

## 🎨 UI/UX

- **WhatsApp-style design** with green theme (#25D366)
- **Smooth animations** with react-native-reanimated
- **Responsive layouts** for all screen sizes
- **Haptic feedback** for better user experience
- **Dark mode support** with automatic theme switching

## 🛠️ Tech Stack

### Frontend (Required)
- **Framework**: React Native + Expo + TypeScript
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Navigation**: React Navigation (Bottom Tabs)
- **UI Components**: Custom WhatsApp-style components
- **File Handling**: expo-document-picker, xlsx
- **Animations**: react-native-reanimated

### Backend (Optional)
- **Runtime**: Node.js + Express
- **Database**: SQLite
- **ORM**: Prisma
- **Purpose**: Backup/sync only (no message sending)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- Android Studio (for Android) or Xcode (for iOS)
- WhatsApp installed on test device

### Setup

1. **Clone or navigate to the project**
```bash
cd wa-bulk-sender
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device/emulator**
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web (for testing UI)
npm run web
```

## 📱 Usage Guide

### 1. Import Contacts

**From CSV/XLSX:**
1. Tap **Contacts** tab
2. Tap **Import** button
3. Select your CSV/XLSX file
4. Map columns (Name and Phone)
5. Preview and confirm import

**CSV Format Example:**
```csv
Name,Phone,Company,Email
John Doe,+1234567890,Acme Inc,john@example.com
Jane Smith,+0987654321,Tech Corp,jane@example.com
```

**Manual Add:**
1. Tap **Contacts** tab
2. Tap **Add** button
3. Enter name and phone number
4. Tap **Add**

### 2. Create Message Template

1. Tap **Message** tab
2. Enter your message in the text area
3. Use placeholders for personalization:
   - `{name}` - Contact name
   - `{phone}` - Contact phone
   - `{col1}`, `{col2}`, etc. - Custom fields from CSV

**Example Template:**
```
Hi {name}! 👋

This is a personalized message for you.

Your phone: {phone}
Company: {col3}

Best regards!
```

### 3. Configure Send Settings

1. Toggle **Auto Send** (optional)
2. Adjust **Delay** slider (2-10 seconds)
3. Set **Country Code** in Settings (default: +1)

### 4. Send Messages

**Auto Send Mode:**
1. Tap **Send to All** button
2. App will open WhatsApp for each contact automatically
3. Manually press SEND in WhatsApp for each message
4. App waits for configured delay between contacts

**Manual Mode:**
1. Tap **Send to Next Contact**
2. WhatsApp opens with pre-filled message
3. Press SEND in WhatsApp
4. Return to app and repeat

### 5. Track Activity

1. Tap **Logs** tab
2. View **All**, **Success**, or **Error** logs
3. Tap **Retry Failed** to resend to failed contacts
4. Tap **Clear Logs** to remove all logs

## 🔧 Configuration

### Settings Options

| Setting | Description | Default |
|---------|-------------|---------|
| Dark Mode | Enable dark theme | Off |
| Auto Send | Automatically open WhatsApp for each contact | Off |
| Send Delay | Delay between messages (2-10s) | 5s |
| Country Code | Default country code for phone numbers | +1 |

### Storage Keys

All data is stored locally using AsyncStorage:
- `@wa_bulk_sender:contacts` - Contact list
- `@wa_bulk_sender:templates` - Message templates
- `@wa_bulk_sender:logs` - Activity logs
- `@wa_bulk_sender:settings` - App settings
- `@wa_bulk_sender:sent_contacts` - Sent contact IDs

## 📂 Project Structure

```
wa-bulk-sender/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card)
│   ├── ContactCard.tsx # Contact list item
│   └── LogItem.tsx     # Log list item
├── screens/            # Main app screens
│   ├── DashboardScreen.tsx
│   ├── ContactsScreen.tsx
│   ├── MessageScreen.tsx
│   ├── LogsScreen.tsx
│   └── SettingsScreen.tsx
├── services/           # Business logic
│   ├── storage.service.ts    # AsyncStorage operations
│   ├── import.service.ts     # CSV/XLSX import
│   └── whatsapp.service.ts   # WhatsApp deep links
├── store/              # State management
│   └── useAppStore.ts  # Zustand store
├── utils/              # Utilities
│   ├── constants.ts    # App constants
│   ├── phoneValidator.ts
│   └── messageParser.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── app.json            # Expo configuration
```

## 🏗️ Building for Production

### Android APK

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Configure EAS**
```bash
eas build:configure
```

3. **Build APK**
```bash
eas build --platform android --profile preview
```

4. **Download APK** from the provided link

### iOS IPA (macOS only)

```bash
eas build --platform ios --profile preview
```

## 🌐 Optional Backend Setup

The backend is **optional** and only used for backup/sync functionality.

### Setup

1. **Navigate to backend folder**
```bash
mkdir backend && cd backend
```

2. **Initialize Node.js project**
```bash
npm init -y
```

3. **Install dependencies**
```bash
npm install express prisma @prisma/client cors dotenv
npm install -D typescript @types/node @types/express ts-node nodemon
```

4. **Create Prisma schema** (see backend section below)

5. **Run migrations**
```bash
npx prisma migrate dev
```

6. **Start server**
```bash
npm run dev
```

### Backend API Endpoints

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template

### Free Hosting Options

- **Railway** - https://railway.app (Free tier)
- **Render** - https://render.com (Free tier)
- **Fly.io** - https://fly.io (Free tier)

## 🔒 Privacy & Security

- ✅ All data stored locally on device
- ✅ No external API calls (except optional backend)
- ✅ No analytics or tracking
- ✅ No data collection
- ✅ Open source and transparent
- ✅ WhatsApp Terms of Service compliant

## ⚠️ Legal Notice

This app does **NOT** automate WhatsApp internally. It only uses WhatsApp's official deep link feature (`https://wa.me/`) to pre-fill messages. **You must manually press SEND in WhatsApp for each message.**

This ensures:
- ✅ Compliance with WhatsApp Terms of Service
- ✅ No risk of account ban
- ✅ Respect for recipient privacy
- ✅ Legal use of WhatsApp platform

**Use responsibly and respect privacy laws (GDPR, CCPA, etc.)**

## 🐛 Troubleshooting

### WhatsApp not opening
- Ensure WhatsApp is installed on your device
- Check app permissions in device settings
- Verify phone numbers are in correct format

### Import not working
- Ensure CSV/XLSX file is properly formatted
- Check file permissions
- Try with a smaller file first

### Messages not sending
- Verify internet connection
- Check WhatsApp is logged in
- Ensure phone numbers are valid

### Dark mode not working
- Restart the app
- Check Settings > Appearance > Dark Mode

## 📝 Sample CSV Template

Create a CSV file with this format:

```csv
Name,Phone,Company,Email,City
John Doe,+1234567890,Acme Inc,john@example.com,New York
Jane Smith,+0987654321,Tech Corp,jane@example.com,San Francisco
Bob Johnson,+1122334455,StartupXYZ,bob@example.com,Austin
```

Then use placeholders in your message:
```
Hi {name}!

I noticed you're from {col5} and work at {col3}.

Let's connect!
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- WhatsApp for the deep link API
- Expo team for the amazing framework
- React Native community

## 📧 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for the community**

**Remember**: Use this tool responsibly and respect privacy laws. Always get consent before sending bulk messages.
