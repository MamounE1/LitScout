# LitScout Backend

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up PostgreSQL database:
```bash
createdb litscout
psql litscout < db/schema.sql
```

3. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

4. For Google OAuth:
   - Go to Google Cloud Console
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: http://localhost:3001/auth/google/callback
   - Copy Client ID and Secret to .env

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login with email/password
- GET `/auth/google` - Initiate Google OAuth
- GET `/auth/google/callback` - OAuth callback
- GET `/auth/me` - Get current user (requires auth)

### Favorites
- GET `/favorites` - Get user's favorites (requires auth)
- POST `/favorites/:bookId` - Add favorite (requires auth)
- DELETE `/favorites/:bookId` - Remove favorite (requires auth)

All authenticated endpoints require `Authorization: Bearer <token>` header.
