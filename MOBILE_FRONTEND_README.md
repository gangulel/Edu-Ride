# Edu-Ride Mobile Application

## Overview

This is the mobile application frontend for the Edu-Ride school transportation management platform, built with React Native and Expo Router.

## Features Implemented

### 🎨 Shared UI Components
- **Button** - Multi-variant button component (primary, secondary, danger, success, outline)
- **Card** - Elevated card container component
- **SearchBar** - Search input with clear functionality
- **Rating** - Star rating display component
- **Badge** - Status badge component with multiple variants
- **Avatar** - User avatar with verification badge support

### 🔐 Authentication & Onboarding
- **Welcome Screen** (`/welcome`) - Onboarding carousel with 4 slides
- **Role Selection** (`/role-selection`) - Choose between Parent or Driver role
- **Login/Register** - Existing in `/login/` directory

### 👥 Parent Features

#### Home Dashboard (`/parent/home`)
- Active subscription card with quick actions
- Search for school bus services
- Filter services (verified drivers, ratings)
- Service cards with driver info, ratings, and pricing
- Bottom navigation

#### Service Discovery (`/parent/service-details`)
- Complete driver profile with verification
- Vehicle information and photos
- Route & schedule with timeline view
- Pricing options (monthly/weekly)
- Reviews and ratings
- Tabbed interface (Overview, Vehicle, Reviews)

#### Booking (`/parent/booking`)
- Subscription plan selection
- Child information form
- Pickup details and special instructions
- Terms and conditions
- Booking summary

#### Payment (`/parent/payment`)
- Payment method selection (Card, Bank Transfer, Mobile Wallet)
- Payment summary with breakdown
- Auto-renewal toggle
- Secure payment processing

### 🚌 Driver Features

#### Dashboard (`/driver/home`)
- Online/Offline status toggle
- Revenue overview card
- Today's schedule with morning/afternoon routes
- Route timeline with stops and timings
- Booking requests list with accept/decline actions
- Quick action cards

#### Student Management (`/driver/students`)
- Complete student roster
- Search and filter by school
- Student cards with parent info
- Pickup/dropoff details
- Special instructions display
- Quick actions (Message, Call)

### 💬 Messaging

#### Messages List (`/messages/index`)
- Conversation list
- Unread message badges
- Search conversations
- Last message preview

#### Chat Interface (`/messages/chat`)
- Real-time chat interface
- Quick message templates
- Message history
- Read receipts

## Project Structure

```
mobile/
├── app/
│   ├── components/
│   │   └── ui/
│   │       ├── Avatar.jsx
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Rating.jsx
│   │       └── SearchBar.jsx
│   ├── driver/
│   │   ├── home.jsx
│   │   ├── students.jsx
│   │   └── ...
│   ├── parent/
│   │   ├── home.jsx
│   │   ├── service-details.jsx
│   │   ├── booking.jsx
│   │   └── payment.jsx
│   ├── messages/
│   │   ├── index.jsx
│   │   └── chat.jsx
│   ├── welcome.jsx
│   ├── role-selection.jsx
│   └── index.jsx
└── ...
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo Router** - File-based routing
- **Expo Vector Icons** (Ionicons) - Icon library
- **React Native Safe Area Context** - Safe area handling

## Design System

### Colors
- **Primary**: `#2563eb` (Blue)
- **Success**: `#16a34a` (Green)
- **Danger**: `#dc2626` (Red)
- **Warning**: `#f59e0b` (Orange)
- **Gray Scale**: `#f9fafb` to `#1f2937`

### Typography
- **Headings**: Bold, 20-28px
- **Body**: Regular/Medium, 14-16px
- **Captions**: Regular, 12-13px

### Spacing
- **Base unit**: 4px
- **Card padding**: 16px
- **Screen padding**: 20px
- **Element gaps**: 8-12px

## Key Screens Per User Role

### Parent Flow
1. Welcome/Onboarding
2. Role Selection
3. Login/Register
4. Home Dashboard
5. Service Details
6. Booking Form
7. Payment
8. Messages

### Driver Flow
1. Welcome/Onboarding
2. Role Selection
3. Login/Register
4. Dashboard
5. Student Management
6. Booking Requests
7. Route Management
8. Messages

## Data Models (Mock)

### Service
```javascript
{
  id, driverName, verified, rating, reviewCount,
  monthlyFee, weeklyFee, route, vehicle, photo
}
```

### Student
```javascript
{
  id, name, grade, school, parentName, parentPhone,
  pickupAddress, pickupTime, dropoffTime,
  specialInstructions, status
}
```

### Conversation
```javascript
{
  id, name, role, lastMessage, timestamp,
  unreadCount, photo, verified
}
```

## API Integration Points

All screens currently use mock data. To integrate with the backend:

1. Replace mock data arrays with API calls
2. Use `useEffect` hooks to fetch data on mount
3. Implement loading and error states
4. Add refresh functionality with `RefreshControl`

Example API integration pattern:

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

## Navigation Structure

```
/ (index)
├── /welcome
├── /role-selection
├── /login/
│   ├── login
│   ├── register
│   └── forgot
├── /parent/
│   ├── home
│   ├── service-details
│   ├── booking
│   ├── payment
│   ├── bookings
│   ├── profile
│   └── ...
├── /driver/
│   ├── home
│   ├── students
│   ├── earnings
│   ├── routes
│   ├── profile
│   └── ...
└── /messages/
    ├── index
    └── chat
```

## State Management

Currently using local state with `useState`. For production:

- Implement Context API for global state (auth, user profile)
- Use AsyncStorage for persisting data
- Consider React Query for server state management

## Form Validation

Implement validation for:
- Booking form (required fields)
- Payment form (card details)
- Profile updates

Use libraries like:
- `react-hook-form`
- `yup` for schema validation

## Authentication Flow

To implement full authentication:

1. **Firebase Integration**
   - Configure Firebase in `app.json`
   - Add Firebase SDK
   - Implement auth context

2. **Protected Routes**
   - Create auth wrapper component
   - Check authentication status
   - Redirect to login if not authenticated

3. **Token Management**
   - Store JWT tokens in SecureStore
   - Add auth headers to API requests
   - Handle token refresh

## Next Steps

1. **Complete Missing Screens**
   - Profile screens
   - Settings screens
   - Route management for drivers
   - Payment history
   - Booking history

2. **Real-time Features**
   - WebSocket integration for chat
   - Push notifications
   - Real-time booking updates

3. **Maps Integration**
   - Route visualization
   - Live location tracking
   - Pickup/dropoff location selection

4. **Offline Support**
   - Cache critical data
   - Queue actions when offline
   - Sync when connection restored

5. **Testing**
   - Unit tests for components
   - Integration tests for flows
   - E2E testing with Detox

6. **Performance Optimization**
   - Image optimization
   - Lazy loading
   - List virtualization
   - Code splitting

## Running the App

```bash
# Install dependencies
cd mobile
npm install

# Start Expo
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Building for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Environment Variables

Create a `.env` file:

```
API_URL=https://api.edu-ride.com
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
GOOGLE_MAPS_API_KEY=your_key
PAYMENT_GATEWAY_KEY=your_key
```

## Accessibility

Ensure accessibility:
- Add `accessibilityLabel` to interactive elements
- Proper color contrast
- Font scaling support
- Screen reader compatibility

## Internationalization

For Sinhala/English support:
- Use `i18next` library
- Create translation files
- Implement language toggle
- Persist language preference

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)

## License

Copyright © 2026 Edu-Ride
