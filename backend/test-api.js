// Test the API endpoints using this file

// 1. Test Registration (POST)
const testRegistration = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Driver',
        email: 'driver@test.com',
        mobile: '+1234567890',
        password: 'password123',
        userType: 'driver'
      })
    });
    
    const data = await response.json();
    console.log('Registration Response:', data);
  } catch (error) {
    console.error('Registration Error:', error);
  }
};

// 2. Test Get All Users (GET)
const testGetUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    console.log('Users:', data);
  } catch (error) {
    console.error('Get Users Error:', error);
  }
};

// 3. Test Get Drivers Only (GET with filter)
const testGetDrivers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users?userType=driver');
    const data = await response.json();
    console.log('Drivers:', data);
  } catch (error) {
    console.error('Get Drivers Error:', error);
  }
};

// 4. Test Get Statistics (GET)
const testGetStats = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/stats?userType=driver');
    const data = await response.json();
    console.log('Driver Stats:', data);
  } catch (error) {
    console.error('Get Stats Error:', error);
  }
};

// Run tests
console.log('Testing API Endpoints...\n');

// Uncomment the tests you want to run:
// testRegistration();
// testGetUsers();
// testGetDrivers();
// testGetStats();
