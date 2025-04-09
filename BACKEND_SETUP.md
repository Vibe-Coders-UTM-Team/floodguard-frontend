# FloodGuard+ Backend Setup

This document provides instructions for setting up the backend API for the FloodGuard+ app.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Firebase project (for authentication)

## Backend Setup

1. **Clone the backend repository**

   ```bash
   git clone https://github.com/your-username/floodguard-plus-backend.git
   cd floodguard-plus-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/floodguard
   JWT_SECRET=your_jwt_secret_key
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

4. **Set up Firebase Admin SDK**

   The backend uses Firebase Admin SDK to verify authentication tokens. You need to:

   - Go to Firebase Console > Project Settings > Service Accounts
   - Generate a new private key
   - Use the values from the downloaded JSON file to set the environment variables

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The server should start on port 3000 (or the port specified in your .env file).

## API Endpoints

### Authentication

All endpoints require a valid Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### Flood Reports

- **Create a new flood report**
  - `POST /api/v1/report`
  - Required fields:
    - userId (string)
    - description (string)
    - level (string: 'minor', 'moderate', 'severe')
    - latitude (number)
    - longitude (number)
    - location (string)
  - Optional fields:
    - imageUrls (array of strings)
    - children_under_5 (number)
    - elderly_members (number)
    - household_size (number)
    - disabled_bedridden_members (number)
    - has_medical_conditions (boolean)
    - pets_livestock (number)

- **Get all flood reports**
  - `GET /api/v1/reports`

- **Get user's flood reports**
  - `GET /api/v1/reports/user`

## Database Schema

### Flood Report

```javascript
{
  userId: String,
  description: String,
  level: String,
  latitude: Number,
  longitude: Number,
  location: String,
  imageUrls: [String],
  status: String,
  children_under_5: Number,
  elderly_members: Number,
  household_size: Number,
  disabled_bedridden_members: Number,
  has_medical_conditions: Boolean,
  pets_livestock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Connecting the Mobile App

To connect the mobile app to your backend:

1. Update the `BASE_URL` in `services/api.js` to point to your backend server:

   ```javascript
   const BASE_URL = 'http://your-server-ip:3000/api/v1';
   ```

   Note: When testing with Expo on a physical device, use your computer's local IP address instead of localhost.

2. Make sure your Firebase project is properly configured in both the backend and the mobile app.

## Troubleshooting

- **CORS Issues**: If you encounter CORS issues, make sure your backend has CORS middleware enabled.
- **Authentication Errors**: Verify that your Firebase configuration is correct in both the app and backend.
- **Network Errors**: Check that your device/emulator can reach the backend server IP address.

## Development Notes

- The backend validates all incoming requests to ensure data integrity
- All timestamps are stored in UTC
- Images should be uploaded to Firebase Storage before creating a report
- The backend does not handle image uploads directly
