# 🚀 Quick Start Guide - Complete Integration

## What's Been Implemented

✅ **MongoDB Database Schema** - User model for drivers, parents, and students
✅ **Backend API** - Complete REST API with Express.js
✅ **Mobile App Registration** - Connected to real backend
✅ **Admin Portal** - Real-time user management from database

---

## 🏃‍♂️ Quick Start (3 Commands)

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
**Expected Output:**
```
Server running on port 3000
Database connected localhost:27017
```

### 2. Start Mobile App
```bash
cd mobile
npx expo start
```
Press `a` for Android or `i` for iOS

### 3. Start Admin Portal
```bash
cd admin
npm run dev
```
Open: http://localhost:5173

---

## 📊 Test the Complete Flow

### Step 1: Register a Driver
1. Open mobile app
2. Tap "Sign up"
3. Fill in details:
   - Name: John Driver
   - Email: john@driver.com
   - Mobile: +1234567890
   - Password: test123
   - Select: **Driver**
4. Tap "Sign up"

### Step 2: View in Admin Portal
1. Open http://localhost:5173
2. Click "User Management" in sidebar
3. Click "Drivers" tab
4. See John Driver with "pending" status

### Step 3: Approve the Driver
1. Click the green checkmark icon (✓)
2. Status changes to "active"
3. Driver can now use the app

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js     # Registration & Login
│   │   └── userController.js     # User Management
│   ├── models/
│   │   └── User.js               # MongoDB Schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── userRoutes.js         # /api/users/*
│   ├── lib/
│   │   └── db.js                 # Database Connection
│   └── index.js                  # Server Entry Point
├── .env                          # Environment Variables
└── package.json

mobile/
└── app/
    └── login/
        └── register.jsx          # Connected to Backend

admin/
└── src/
    └── components/
        └── UserManagement.tsx    # Real-time from DB
```

---

## 🔌 API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user

### User Management
- **GET** `/api/users` - Get all users
- **GET** `/api/users?userType=driver` - Get only drivers
- **GET** `/api/users/stats` - Get statistics
- **GET** `/api/users/:id` - Get specific user
- **PATCH** `/api/users/:id/status` - Approve/Suspend user
- **PUT** `/api/users/:id` - Update user details
- **DELETE** `/api/users/:id` - Delete user

---

## 🗄️ Database Setup

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - macOS: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB:**
   ```bash
   # Windows (Run as Administrator)
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Verify .env file:**
   ```
   MONGO_URL=mongodb://localhost:27017/eduride
   PORT=3000
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/eduride
   PORT=3000
   ```

---

## 🧪 Test the API

### Using Browser
- Health: http://localhost:3000/
- All Users: http://localhost:3000/api/users
- Stats: http://localhost:3000/api/users/stats

### Using Command Line
```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "email": "test@driver.com",
    "mobile": "+1234567890",
    "password": "test123",
    "userType": "driver"
  }'

# Get all users
curl http://localhost:3000/api/users

# Get only drivers
curl http://localhost:3000/api/users?userType=driver
```

---

## 🎯 Features

### Mobile App
- ✅ User registration (Driver/Student)
- ✅ Real-time email validation
- ✅ Password strength indicator
- ✅ Network error handling
- ✅ Auto-navigation after signup

### Admin Portal
- ✅ View all users (Parents & Drivers)
- ✅ Real-time statistics
- ✅ Approve/Reject pending drivers
- ✅ Suspend/Activate users
- ✅ Search functionality
- ✅ View user details
- ✅ Filter by status

### Backend
- ✅ RESTful API design
- ✅ MongoDB integration
- ✅ CORS enabled
- ✅ Error handling
- ✅ Input validation
- ✅ Separate schemas for different user types

---

## �️ Troubleshooting

### "Network request failed" in Mobile App

The mobile app can't use "localhost" - you need to use your computer's IP address.

**Quick Fix:**

1. **Find your IP:**
   ```bash
   # Run this script
   find-ip.bat
   
   # Or manually run
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. **Update API config:**
   - Open `mobile/app/config/api.js`
   - Change `PHYSICAL_DEVICE_URL` to your IP:
   ```javascript
   const PHYSICAL_DEVICE_URL = 'http://192.168.1.100:3000'; // Your IP here
   ```

3. **Restart mobile app:**
   ```bash
   npx expo start --clear
   ```

**See [MOBILE_NETWORK_FIX.md](MOBILE_NETWORK_FIX.md) for detailed instructions.**

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### "Port 3000 already in use"
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### "Mobile app can't connect to backend"
- Ensure backend is running on port 3000
- Check backend console for errors
- For physical device, use your computer's IP address instead of localhost

### "Admin portal shows no data"
- Open browser console (F12)
- Check for CORS errors
- Verify backend API is responding at http://localhost:3000/api/users

---

## 📝 Database Collections

After running the app, you'll see this in MongoDB:

### `users` Collection
```javascript
{
  _id: ObjectId("..."),
  name: "John Driver",
  email: "john@driver.com",
  mobile: "+1234567890",
  password: "test123",  // In production, this should be hashed!
  userType: "driver",
  status: "pending",
  vehicle: null,
  route: null,
  rating: 0,
  trips: 0,
  children: 0,
  complaints: 0,
  createdAt: ISODate("2026-01-15T..."),
  updatedAt: ISODate("2026-01-15T...")
}
```

---

## 🔐 Security Note

⚠️ **Important for Production:**

Current implementation stores passwords in plain text. Before deploying:

1. Install bcrypt: `npm install bcrypt`
2. Hash passwords in authController.js
3. Add JWT authentication
4. Implement rate limiting
5. Add input sanitization
6. Use HTTPS

---

## 🎓 Next Steps

1. ✅ **Completed:** Database integration
2. ✅ **Completed:** Mobile registration → Backend
3. ✅ **Completed:** Admin portal → Database
4. **TODO:** Password hashing (bcrypt)
5. **TODO:** JWT authentication
6. **TODO:** Login functionality
7. **TODO:** User profile management
8. **TODO:** Route and vehicle assignment

---

## 📞 Support

For issues:
1. Check all three services are running (backend, mobile, admin)
2. Verify MongoDB is connected
3. Check browser/terminal console for errors
4. Review logs in each terminal window

---

**Congratulations! 🎉** 

Your Edu-Ride app now has a fully functional backend with:
- Real database storage
- Mobile app registration
- Admin user management
- Live statistics

The system is ready for testing and further development!
