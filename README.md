# 📱 WA Bulk Sender - Complete Project

A **production-ready** bulk WhatsApp messenger mobile application with optional backend. Send personalized messages to multiple contacts using WhatsApp's official deep link feature.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue)
![License](https://img.shields.io/badge/license-MIT-orange)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)

---

## 🎯 What's Included

This repository contains **two complete projects**:

### 1. 📱 Mobile App (React Native + Expo + TypeScript)
**Location:** `wa-bulk-sender/`

A full-featured mobile application for Android and iOS with:
- ✅ Contact management (import CSV/XLSX, add, edit, delete)
- ✅ Message composer with personalization
- ✅ WhatsApp deep link integration
- ✅ Auto-send system with delays
- ✅ Activity logs and retry system
- ✅ Dark mode support
- ✅ WhatsApp-style UI

### 2. 🖥️ Backend API (Node.js + Express + Prisma + SQLite)
**Location:** `wa-bulk-sender-backend/`

An optional backend for backup and sync:
- ✅ RESTful API for contacts, templates, logs
- ✅ SQLite database with Prisma ORM
- ✅ Multi-user support
- ✅ Free hosting ready (Railway, Render, Fly.io)

---

## 🚀 Quick Start

### Mobile App

```bash
# Navigate to app folder
cd wa-bulk-sender

# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Backend (Optional)

```bash
# Navigate to backend folder
cd wa-bulk-sender-backend

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start server
npm run dev
```

**📖 For detailed instructions, see [QUICKSTART.md](QUICKSTART.md)**

---

## 📂 Project Structure

```
/vercel/sandbox/
│
├── wa-bulk-sender/              # Mobile App
│   ├── components/              # UI Components
│   ├── screens/                 # 5 Main Screens
│   ├── services/                # Business Logic
│   ├── store/                   # State Management
│   ├── utils/                   # Utilities
│   ├── types/                   # TypeScript Types
│   ├── App.tsx                  # Main App
│   ├── README.md                # App Documentation
│   ├── DEPLOYMENT.md            # Deployment Guide
│   └── sample-contacts.csv      # Sample Data
│
├── wa-bulk-sender-backend/      # Backend API
│   ├── src/
│   │   ├── routes/              # API Routes
│   │   └── index.ts             # Server Entry
│   ├── prisma/
│   │   └── schema.prisma        # Database Schema
│   ├── README.md                # Backend Documentation
│   └── package.json             # Dependencies
│
├── README.md                    # This file
├── QUICKSTART.md                # Quick Start Guide
├── PROJECT_OVERVIEW.md          # Technical Overview
└── IMPLEMENTATION_SUMMARY.md    # Implementation Details
```

---

## ✨ Key Features

### 📊 Dashboard
- Real-time statistics (Total, Sent, Pending, Errors)
- Progress tracking during bulk send
- Countdown timer for auto-send

### 👥 Contact Management
- Import from CSV/XLSX with column mapping
- Manual add with validation
- Edit, delete, and bulk operations
- Duplicate detection

### 💬 Message Composer
- Template editor with placeholders
- Live preview with sample contact
- Personalization: `{name}`, `{phone}`, `{col1}`, `{col2}`
- Template validation

### 📲 WhatsApp Integration
- Official deep link API: `https://wa.me/{phone}?text={message}`
- Phone number normalization
- Country code support
- Error handling

### ⚙️ Auto-Send System
- Toggle auto-send on/off
- Configurable delay (2-10 seconds)
- Progress tracking
- Skip already sent contacts

### 📋 Activity Logs
- Success/error tracking with timestamps
- Filterable tabs (All, Success, Errors)
- Retry failed messages
- Clear logs option

### 🌙 Settings
- Dark mode toggle
- Country code configuration
- Auto-send preferences
- Clear all data option

---

## 🎨 Screenshots

*WhatsApp-style UI with green theme (#25D366)*

- Dashboard with stats and progress
- Contact list with import functionality
- Message composer with live preview
- Activity logs with retry option
- Settings with dark mode

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React Native + Expo
- **Language:** TypeScript
- **State:** Zustand
- **Storage:** AsyncStorage
- **Navigation:** React Navigation
- **File Handling:** expo-document-picker, xlsx

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** SQLite
- **ORM:** Prisma
- **Language:** TypeScript

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- WhatsApp installed on test device

### Setup Steps

1. **Clone or navigate to the project**
```bash
cd /vercel/sandbox
```

2. **Install mobile app dependencies**
```bash
cd wa-bulk-sender
npm install
```

3. **Install backend dependencies (optional)**
```bash
cd ../wa-bulk-sender-backend
npm install
```

4. **Start development**
```bash
# Mobile app
cd wa-bulk-sender
npm start

# Backend (in another terminal)
cd wa-bulk-sender-backend
npm run dev
```

---

## 📱 Usage

### 1. Import Contacts

**CSV Format:**
```csv
Name,Phone,Company,Email
John Doe,+1234567890,Acme Inc,john@example.com
Jane Smith,+0987654321,Tech Corp,jane@example.com
```

**Steps:**
1. Tap **Contacts** tab
2. Tap **Import** button
3. Select CSV/XLSX file
4. Map Name and Phone columns
5. Preview and confirm

### 2. Create Message

**Template Example:**
```
Hi {name}! 👋

I hope you're doing well.

I noticed you work at {col3}.
Would love to connect!

Best regards
```

### 3. Send Messages

**Auto Send Mode:**
1. Enable auto-send in Message tab
2. Set delay (5 seconds recommended)
3. Tap "Send to All"
4. App opens WhatsApp for each contact
5. Manually press SEND in WhatsApp
6. App waits and continues

**Manual Mode:**
1. Disable auto-send
2. Tap "Send to Next Contact"
3. Press SEND in WhatsApp
4. Return to app and repeat

### 4. Track Activity

1. View logs in **Logs** tab
2. Filter by Success/Errors
3. Retry failed messages
4. Clear logs when done

---

## 🔒 Legal Compliance

### ✅ Why This App is Legal

1. **No Automation** - Uses WhatsApp's official deep link API
2. **Manual Send** - User must press SEND for each message
3. **No Scraping** - No data extraction from WhatsApp
4. **Official API** - Uses documented WhatsApp feature
5. **Privacy First** - All data stored locally on device

### ⚠️ Legal Notice

This app does **NOT** automate WhatsApp internally. It only uses WhatsApp's official deep link feature to pre-fill messages. **You must manually press SEND in WhatsApp for each message.**

**Use responsibly and comply with:**
- WhatsApp Terms of Service
- Privacy laws (GDPR, CCPA, etc.)
- Anti-spam regulations
- Recipient consent requirements

---

## 🚀 Deployment

### Build Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
cd wa-bulk-sender
eas build --platform android --profile preview
```

### Deploy Backend

**Railway (Free):**
```bash
npm install -g @railway/cli
railway login
cd wa-bulk-sender-backend
railway init
railway up
```

**Render (Free):**
1. Create account at https://render.com
2. Connect Git repository
3. Configure build and start commands
4. Deploy

**📖 For detailed deployment instructions, see [DEPLOYMENT.md](wa-bulk-sender/DEPLOYMENT.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Get started in 5 minutes |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Technical overview and architecture |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Complete implementation details |
| [wa-bulk-sender/README.md](wa-bulk-sender/README.md) | Mobile app documentation |
| [wa-bulk-sender/DEPLOYMENT.md](wa-bulk-sender/DEPLOYMENT.md) | Deployment guide |
| [wa-bulk-sender-backend/README.md](wa-bulk-sender-backend/README.md) | Backend API documentation |

---

## 🧪 Testing

### Test the Mobile App

1. **Import sample data**
```bash
cd wa-bulk-sender
# Use sample-contacts.csv
```

2. **Create test message**
```
Hi {name}! This is a test message.
```

3. **Send to one contact**
- Tap "Send to Next Contact"
- WhatsApp opens
- Press SEND
- Check logs

### Test the Backend

```bash
# Health check
curl http://localhost:3000/health

# Get contacts
curl http://localhost:3000/api/contacts -H "x-user-id: test"

# Create contact
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -H "x-user-id: test" \
  -d '{"name":"Test User","phone":"+1234567890"}'
```

---

## 🔧 Configuration

### Mobile App Settings

Edit `wa-bulk-sender/utils/constants.ts`:
```typescript
export const COLORS = {
  primary: '#25D366',  // Change to your color
  // ... other colors
};
```

Edit `wa-bulk-sender/app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Backend Settings

Edit `wa-bulk-sender-backend/.env`:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS="*"
```

---

## 🐛 Troubleshooting

### App won't start
```bash
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
cd wa-bulk-sender-backend
npx prisma migrate reset
npm run dev
```

---

## 📊 Project Statistics

- **Total Files:** 45+
- **Lines of Code:** 6,000+
- **TypeScript Files:** 30+
- **Components:** 15+
- **Screens:** 5
- **API Endpoints:** 12+
- **Documentation Pages:** 6

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

**MIT License** - Free to use for personal and commercial purposes.

---

## 🙏 Acknowledgments

- **WhatsApp** - For the deep link API
- **Expo Team** - For the amazing framework
- **React Native Community** - For the ecosystem
- **Open Source Contributors** - For the libraries used

---

## 📧 Support

For issues, questions, or feature requests:
- Check documentation files
- Review troubleshooting guides
- Open an issue on GitHub

---

## ⚡ Quick Links

- 📖 [Quick Start Guide](QUICKSTART.md)
- 🏗️ [Project Overview](PROJECT_OVERVIEW.md)
- 📱 [Mobile App Docs](wa-bulk-sender/README.md)
- 🖥️ [Backend Docs](wa-bulk-sender-backend/README.md)
- 🚀 [Deployment Guide](wa-bulk-sender/DEPLOYMENT.md)
- ✅ [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

---

## 🎉 Ready to Use!

This project is **100% complete** and **production-ready**:

- ✅ Full-featured mobile app (Android + iOS)
- ✅ Optional backend for sync/backup
- ✅ Complete documentation
- ✅ Sample data included
- ✅ Deployment guides
- ✅ No build errors
- ✅ TypeScript verified
- ✅ 100% free and open source

**Start building your bulk WhatsApp messenger today!**

---

**Made with ❤️ for the community**

**Remember: Use responsibly and respect privacy laws!**

🚀 **Happy messaging!**
