// API Configuration
// Update this IP address to match your computer's local IP

// To find your IP address:
// Windows: Run 'ipconfig' in terminal, look for IPv4 Address
// macOS/Linux: Run 'ifconfig' or 'ip addr show'

// For development, use one of these:
// - Your computer's local IP (e.g., 192.168.1.100)
// - For Android Emulator: 10.0.2.2
// - For iOS Simulator: localhost works fine
// - For Expo Go on physical device: Your computer's IP address

const getApiUrl = () => {
  // Change this to your computer's IP address
  // Example: const BASE_URL = 'http://192.168.1.100:3000';
  
  // For Android Emulator (use this if testing on Android emulator)
  const ANDROID_EMULATOR_URL = 'http://10.0.2.2:3000';
  
  // For physical device or Expo Go (replace with your actual IP)
  const PHYSICAL_DEVICE_URL = 'http://192.168.1.100:3000'; // UPDATE THIS!
  
  // For iOS Simulator
  const IOS_SIMULATOR_URL = 'http://localhost:3000';
  
  // Detect platform and return appropriate URL
  const Platform = require('react-native').Platform;
  
  if (Platform.OS === 'android') {
    // For Android Emulator
    return ANDROID_EMULATOR_URL;
  } else if (Platform.OS === 'ios') {
    // For iOS Simulator
    return IOS_SIMULATOR_URL;
  } else {
    // Default fallback
    return PHYSICAL_DEVICE_URL;
  }
};

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  users: `${API_URL}/api/users`,
  userStats: `${API_URL}/api/users/stats`,
};

console.log('API URL:', API_URL);
