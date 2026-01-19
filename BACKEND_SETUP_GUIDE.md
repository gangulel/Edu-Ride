# Edu-Ride Backend Setup Guide

## 🚀 Database Integration Complete

The mobile app registration is now connected to MongoDB, and driver details will appear in the admin portal.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** installed locally OR MongoDB Atlas account

## Setup Instructions

### 1. Install MongoDB (Choose one option)

#### Option A: Local MongoDB
- Download and install MongoDB from: https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Whitelist your IP address (or use 0.0.0.0/0 for development)

### 2. Configure Backend

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   copy .env.example .env
   ```

3. Edit `.env` file with your MongoDB connection:
   ```
   # For Local MongoDB:
   MONGO_URL=mongodb://localhost:27017/eduride
   
   # For MongoDB Atlas:
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/eduride?retryWrites=true&w=majority
   
   PORT=3000
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 3000
   Database connected [host]
   ```

### 3. Test the API

Open your browser or use Postman to test:
- Health check: http://localhost:3000/
- Get all users: http://localhost:3000/api/users
- Get statistics: http://localhost:3000/api/users/stats

### 4. Run the Mobile App

1. Navigate to mobile folder:
   ```bash
   cd mobile
   ```

2. Start Expo:
   ```bash
   npx expo start
   ```

3. Register a new driver or student in the mobile app

### 5. Run the Admin Portal

1. Navigate to admin folder:
   ```bash
   cd admin
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 and navigate to User Management

## 📋 Features Implemented

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user (driver/parent/student)
- `POST /api/auth/login` - Login user

#### User Management (Admin)
- `GET /api/users` - Get all users (with filters: ?userType=driver&status=active)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/status` - Update user status (approve/suspend)
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete user

### Mobile App
- ✅ Registration form connected to backend
- ✅ Real-time validation
- ✅ Error handling for network issues
- ✅ Success navigation based on user type

### Admin Portal
- ✅ Real-time data from MongoDB
- ✅ Separate tabs for Parents and Drivers
- ✅ Dynamic statistics cards
- ✅ Approve/Suspend users functionality
- ✅ View user details
- ✅ Search and filter users

## 🔄 Testing the Complete Flow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Mobile App**: `cd mobile && npx expo start`
3. **Start Admin Portal**: `cd admin && npm run dev`

4. **Test Registration**:
   - Open mobile app
   - Navigate to Register
   - Fill in details and select "Driver"
   - Submit registration
   - Driver will be created with "pending" status

5. **View in Admin**:
   - Open admin portal at http://localhost:5173
   - Go to User Management
   - Click "Drivers" tab
   - See the newly registered driver with "pending" status
   - Click the green checkmark to approve the driver

## 📝 Database Schema

```javascript
User {
  name: String (required)
  email: String (required, unique)
  mobile: String (required)
  password: String (required)
  userType: 'student' | 'driver' | 'parent'
  status: 'active' | 'pending' | 'suspended'
  
  // Driver fields
  vehicle: String
  route: String
  rating: Number (0-5)
  trips: Number
  
  // Parent fields
  children: Number
  complaints: Number
  
  timestamps: createdAt, updatedAt
}
```

## 🛠️ Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file has correct MONGO_URL
- Verify port 3000 is not in use

### Mobile app can't connect
- Make sure backend is running on port 3000
- Check that CORS is properly configured
- Try using your computer's IP address instead of localhost in mobile app

### Admin portal shows no data
- Verify backend API is running
- Check browser console for errors
- Ensure CORS allows requests from port 5173

## 🔐 Security Notes (Production)

For production deployment, implement:
1. Password hashing with bcrypt
2. JWT tokens for authentication
3. Input validation and sanitization
4. Rate limiting
5. HTTPS/SSL certificates
6. Environment-specific configurations

## 📚 Next Steps

1. Implement password hashing (bcrypt)
2. Add JWT authentication
3. Create login functionality for mobile app
4. Add more user profile fields
5. Implement real-time notifications
6. Add vehicle and route management

---

## Support

If you encounter any issues, check:
1. MongoDB connection string is correct
2. All services are running (backend, mobile, admin)
3. Network connectivity between services
4. Console logs for error messages
