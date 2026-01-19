# 🔧 Mobile App Network Connection Fix

## Problem
The mobile app shows: `ERROR Registration error: [TypeError: Network request failed]`

This happens because mobile devices can't use "localhost" to connect to your development server.

---

## 🚀 Quick Fix

### Step 1: Find Your Computer's IP Address

#### **Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (WiFi or Ethernet).
Example: `192.168.1.100`

#### **macOS:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Or go to: System Preferences → Network → Your active connection

#### **Linux:**
```bash
ip addr show
```
Or:
```bash
hostname -I
```

### Step 2: Update the API Configuration

Open: `mobile/app/config/api.js`

Find this line:
```javascript
const PHYSICAL_DEVICE_URL = 'http://192.168.1.100:3000'; // UPDATE THIS!
```

**Replace `192.168.1.100` with YOUR computer's IP address.**

Example:
```javascript
const PHYSICAL_DEVICE_URL = 'http://192.168.1.45:3000';
```

### Step 3: Restart the Mobile App

Press `Ctrl+C` in the mobile terminal, then:
```bash
npx expo start --clear
```

---

## 📱 Different Testing Scenarios

### **1. Android Emulator (Android Studio)**
Use the default setting in `api.js`:
```javascript
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:3000';
```
`10.0.2.2` is a special IP that Android Emulator uses to access the host machine.

### **2. iOS Simulator (Xcode)**
Use localhost (it works on iOS Simulator):
```javascript
const IOS_SIMULATOR_URL = 'http://localhost:3000';
```

### **3. Physical Device or Expo Go App**
Use your computer's actual IP address:
```javascript
const PHYSICAL_DEVICE_URL = 'http://YOUR_COMPUTER_IP:3000';
```

**Important:** Your phone and computer must be on the **same WiFi network**!

---

## ✅ Verification Steps

### 1. Check Backend is Running
Open in your browser: `http://localhost:3000`

You should see:
```json
{"message": "Edu-Ride API is running"}
```

### 2. Check From Your IP
Open in your browser: `http://YOUR_IP_ADDRESS:3000`

Example: `http://192.168.1.100:3000`

You should see the same message. If not, your firewall might be blocking it.

### 3. Test Mobile App
1. Open the mobile app
2. Go to Register
3. Fill in the form
4. Check the console output - it should show:
   ```
   API URL: http://YOUR_IP:3000
   Attempting registration to: http://YOUR_IP:3000/api/auth/register
   ```

---

## 🐛 Still Not Working?

### Issue: Firewall Blocking Connections

#### **Windows Firewall:**
1. Search for "Windows Defender Firewall"
2. Click "Advanced settings"
3. Click "Inbound Rules"
4. Click "New Rule"
5. Select "Port" → Next
6. Select "TCP" → Specific local ports: `3000` → Next
7. Select "Allow the connection" → Next
8. Check all profiles → Next
9. Name it "Edu-Ride Backend" → Finish

#### **macOS Firewall:**
```bash
# Temporarily disable firewall for testing
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Re-enable after testing
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

### Issue: Wrong Network

Make sure:
- Phone is on **WiFi** (not cellular data)
- Phone is on the **same WiFi network** as your computer
- Not using VPN or proxy

### Issue: Backend Not Accessible

Test if backend is accessible from your network:

**On your phone's browser**, open:
```
http://YOUR_IP_ADDRESS:3000
```

If it doesn't load, the backend isn't accessible on your network.

---

## 🎯 Configuration Examples

### Example 1: Using Android Emulator
```javascript
// mobile/app/config/api.js
const getApiUrl = () => {
  const Platform = require('react-native').Platform;
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';  // Android Emulator
  }
  return 'http://localhost:3000';
};
```

### Example 2: Using Physical iPhone
```javascript
// mobile/app/config/api.js
const getApiUrl = () => {
  return 'http://192.168.1.100:3000';  // Your computer's IP
};
```

### Example 3: Dynamic (Recommended)
```javascript
// mobile/app/config/api.js
const getApiUrl = () => {
  const Platform = require('react-native').Platform;
  
  // Replace with YOUR IP address
  const YOUR_COMPUTER_IP = '192.168.1.100';
  
  if (Platform.OS === 'android') {
    // Check if running on emulator or physical device
    // For emulator, use 10.0.2.2
    // For physical device, use computer's IP
    return `http://10.0.2.2:3000`;
  }
  
  if (Platform.OS === 'ios') {
    // iOS Simulator can use localhost
    return 'http://localhost:3000';
  }
  
  // Fallback to computer's IP
  return `http://${YOUR_COMPUTER_IP}:3000`;
};
```

---

## 📊 Test the Complete Flow

1. **Find your IP:** Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. **Update API config:** Edit `mobile/app/config/api.js`
3. **Restart backend:** 
   ```bash
   cd backend
   npm run dev
   ```
4. **Restart mobile app:**
   ```bash
   cd mobile
   npx expo start --clear
   ```
5. **Test registration:**
   - Open app
   - Go to Register
   - Fill form and submit
   - Check console for success message

---

## 💡 Pro Tips

1. **Keep backend logs visible** - Watch for incoming requests
2. **Check mobile app console** - Look for the API URL being used
3. **Use Expo DevTools** - Check network tab for failed requests
4. **Test API directly** - Use your phone's browser to access the API

---

## 📝 Quick Checklist

- [ ] Backend server is running (`npm run dev`)
- [ ] Found my computer's IP address
- [ ] Updated `mobile/app/config/api.js` with correct IP
- [ ] Phone and computer on same WiFi network
- [ ] Firewall allows port 3000
- [ ] Tested API in phone's browser: `http://YOUR_IP:3000`
- [ ] Restarted mobile app with `--clear` flag
- [ ] Can see "API URL:" in mobile app console

---

## 🎉 Success!

When everything works, you'll see:
```
✅ Registration successful
✅ User saved to MongoDB
✅ Visible in admin portal
```

Your mobile app can now communicate with the backend! 🚀
