# WA Bulk Sender Backend 🚀

Optional backend for **WA Bulk Sender** mobile app. Provides backup and sync functionality only.

**⚠️ IMPORTANT**: This backend does **NOT** send WhatsApp messages. It only provides CRUD operations for contacts, templates, and logs.

## Features

- ✅ **Backup contacts** - Store contacts in SQLite database
- ✅ **Sync templates** - Save and retrieve message templates
- ✅ **Activity logs** - Track message history
- ✅ **Multi-user support** - Separate data per device
- ✅ **RESTful API** - Simple HTTP endpoints
- ✅ **Free hosting** - Deploy on Railway, Render, or Fly.io

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Prisma
- **CORS**: Enabled for mobile app

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Setup

1. **Navigate to backend folder**
```bash
cd wa-bulk-sender-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Edit .env file**
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:19006,exp://localhost:19000"
```

5. **Generate Prisma client**
```bash
npm run prisma:generate
```

6. **Run database migrations**
```bash
npm run prisma:migrate
```

7. **Start development server**
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "WA Bulk Sender Backend",
  "version": "1.0.0"
}
```

### Contacts

**Get all contacts**
```
GET /api/contacts
Headers: x-user-id: <device-id>
```

**Get single contact**
```
GET /api/contacts/:id
Headers: x-user-id: <device-id>
```

**Create contact**
```
POST /api/contacts
Headers: x-user-id: <device-id>
Body: {
  "name": "John Doe",
  "phone": "+1234567890",
  "customFields": { "company": "Acme Inc" },
  "sent": false
}
```

**Bulk create contacts**
```
POST /api/contacts/bulk
Headers: x-user-id: <device-id>
Body: {
  "contacts": [
    { "name": "John", "phone": "+1234567890" },
    { "name": "Jane", "phone": "+0987654321" }
  ]
}
```

**Update contact**
```
PUT /api/contacts/:id
Headers: x-user-id: <device-id>
Body: {
  "sent": true,
  "sentAt": "2024-01-01T00:00:00.000Z"
}
```

**Delete contact**
```
DELETE /api/contacts/:id
Headers: x-user-id: <device-id>
```

**Delete all contacts**
```
DELETE /api/contacts
Headers: x-user-id: <device-id>
```

### Templates

**Get all templates**
```
GET /api/templates
Headers: x-user-id: <device-id>
```

**Create template**
```
POST /api/templates
Headers: x-user-id: <device-id>
Body: {
  "name": "Welcome Message",
  "content": "Hi {name}! Welcome to our service."
}
```

**Update template**
```
PUT /api/templates/:id
Headers: x-user-id: <device-id>
Body: {
  "content": "Updated message content"
}
```

**Delete template**
```
DELETE /api/templates/:id
Headers: x-user-id: <device-id>
```

### Logs

**Get all logs**
```
GET /api/logs?status=success
Headers: x-user-id: <device-id>
```

**Create log**
```
POST /api/logs
Headers: x-user-id: <device-id>
Body: {
  "contactId": "123",
  "contactName": "John Doe",
  "phone": "+1234567890",
  "message": "Test message",
  "status": "success"
}
```

**Delete all logs**
```
DELETE /api/logs
Headers: x-user-id: <device-id>
```

## Database Schema

### Contact
- `id` - UUID
- `userId` - Device ID
- `name` - Contact name
- `phone` - Phone number
- `customFields` - JSON string
- `sent` - Boolean
- `sentAt` - DateTime
- `error` - Error message
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Template
- `id` - UUID
- `userId` - Device ID
- `name` - Template name
- `content` - Message content
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Log
- `id` - UUID
- `userId` - Device ID
- `contactId` - Contact ID
- `contactName` - Contact name
- `phone` - Phone number
- `message` - Sent message
- `status` - 'success' or 'error'
- `error` - Error message
- `timestamp` - DateTime

## Development

### Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Database Management

**View database**
```bash
npm run prisma:studio
```

**Create migration**
```bash
npx prisma migrate dev --name migration_name
```

**Reset database**
```bash
npx prisma migrate reset
```

## Deployment

### Railway (Free)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Deploy**
```bash
railway up
```

5. **Set environment variables**
```bash
railway variables set DATABASE_URL="file:./prod.db"
railway variables set NODE_ENV="production"
```

### Render (Free)

1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables in dashboard
6. Deploy

### Fly.io (Free)

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**
```bash
fly auth login
```

3. **Launch app**
```bash
fly launch
```

4. **Deploy**
```bash
fly deploy
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `ALLOWED_ORIGINS` | CORS origins | `*` |
| `API_KEY` | Optional API key | - |

## Security

- ✅ CORS enabled for mobile app
- ✅ Input validation on all endpoints
- ✅ User isolation via `x-user-id` header
- ✅ No sensitive data exposure
- ⚠️ Add API key authentication for production

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs

Server logs all requests:
```
2024-01-01T00:00:00.000Z - GET /api/contacts
2024-01-01T00:00:01.000Z - POST /api/contacts
```

## Troubleshooting

### Database locked error
```bash
# Stop all processes using the database
pkill -f prisma
# Restart server
npm run dev
```

### Migration failed
```bash
# Reset database
npx prisma migrate reset
# Run migrations again
npm run prisma:migrate
```

### Port already in use
```bash
# Change PORT in .env
PORT=3001
```

## License

MIT License - Free to use for personal and commercial projects.

## Support

For issues or questions, please open an issue on GitHub.

---

**Remember**: This backend does NOT send WhatsApp messages. It only provides backup/sync functionality for the mobile app.
