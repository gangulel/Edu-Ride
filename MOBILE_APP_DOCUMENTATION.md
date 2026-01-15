# Edu-Ride Mobile Application Documentation

**Project:** Edu-Ride Bus Tracking System - Mobile App  
**Generated:** January 15, 2026  
**Platforms:** iOS & Android (React Native + Expo)

---

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [App Architecture](#app-architecture)
4. [User Roles & Features](#user-roles--features)
5. [Core Functions](#core-functions)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Technical Specifications](#technical-specifications)

---

## Overview

Edu-Ride mobile application is a cross-platform solution for parents and drivers to track school buses in real-time, manage trips, process payments, and communicate effectively. Built with React Native and Expo, it provides a seamless experience on both iOS and Android devices.

### App Purpose
- **For Parents:** Track children's bus location, manage payments, communicate with drivers
- **For Drivers:** Manage routes, log trips, receive notifications, track earnings

### Current Status
- **Phase:** Development/Planning
- **Version:** 1.0.0
- **Build System:** Expo ~54.0.20
- **React Native:** 0.81.5

---

## Technology Stack

### Core Framework
```json
{
  "framework": "React Native 0.81.5",
  "platform": "Expo 54.0.20",
  "language": "JavaScript/TypeScript",
  "navigation": "Expo Router 6.0.13",
  "ui_library": "React Native built-in components"
}
```

### Key Dependencies

#### Navigation & Routing
- **expo-router** (v6.0.13) - File-based routing system
- **@react-navigation/native** (v7.1.8) - Navigation framework
- **@react-navigation/bottom-tabs** (v7.4.0) - Tab navigation
- **react-native-screens** (v4.16.0) - Native screen management
- **react-native-gesture-handler** (v2.28.0) - Touch gestures

#### UI & UX
- **@expo/vector-icons** (v15.0.3) - Icon library
- **expo-linear-gradient** (v15.0.7) - Gradient components
- **expo-haptics** (v15.0.7) - Haptic feedback
- **react-native-reanimated** (v4.1.1) - Animations
- **react-native-safe-area-context** (v5.6.0) - Safe area handling

#### System Integration
- **expo-constants** (v18.0.10) - App constants
- **expo-status-bar** (v3.0.8) - Status bar control
- **expo-splash-screen** (v31.0.10) - Splash screen
- **expo-linking** (v8.0.8) - Deep linking
- **expo-system-ui** (v6.0.8) - System UI customization

### Platform Support
- **iOS:** iPhone & iPad support
- **Android:** Edge-to-edge display enabled
- **Web:** PWA capable (Metro bundler)

---

## App Architecture

### Project Structure
```
mobile/
├── app/
│   ├── _layout.jsx          # Root navigation layout
│   ├── index.jsx            # Home/Landing screen
│   └── trips/               # Trip management screens
├── services/                # API integration services
├── assets/                  # Images, fonts, icons
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

### Navigation Pattern
- **File-based routing** using Expo Router
- **Type-safe routes** with TypeScript
- **Deep linking** support for notifications
- **Tab navigation** for main app sections

### App Configuration
```json
{
  "name": "Edu-Ride Mobile",
  "slug": "edu-ride",
  "version": "1.0.0",
  "orientation": "portrait",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true
}
```

---

## User Roles & Features

### 1. Parent User

The primary user group who monitors their children's bus transportation.

#### Dashboard Functions
- **Real-time Bus Tracking**
  - Live GPS location on map
  - Bus route visualization
  - Estimated time of arrival (ETA)
  - Driver information display
  - Bus status (On Route, Delayed, Arrived)

#### Child Management
- **Profile Management**
  - Add multiple children
  - Child photo and details
  - Grade and school information
  - Emergency contact details
  
- **Route Assignment**
  - View assigned bus route
  - Pickup location and time
  - Drop-off location and time
  - Alternate pickup points

#### Trip Tracking
- **Active Trip Monitoring**
  - Real-time location updates
  - Route progress indicator
  - Current stop information
  - Notifications for key events:
    - Bus approaching pickup
    - Child picked up
    - Bus approaching drop-off
    - Child dropped off safely

- **Trip History**
  - Past trip records
  - Date and time logs
  - Pickup/drop-off confirmation
  - Duration and distance
  - Driver ratings

#### Payment Functions
- **Payment Management**
  - View payment plans (Weekly/Monthly)
  - Current balance and dues
  - Payment history with receipts
  - Transaction status tracking
  
- **Payment Processing**
  - Multiple payment methods:
    - Credit/Debit cards
    - Digital wallets
    - Bank transfers
  - Automatic payment setup
  - Payment reminders
  - Failed payment notifications
  
- **Financial Overview**
  - Monthly expense reports
  - Yearly payment summary
  - Download receipts/invoices
  - Tax documentation

#### Communication Features
- **Notifications**
  - Push notifications enabled
  - Real-time alerts for:
    - Route delays
    - Emergency situations
    - Weather-related changes
    - Schedule updates
    - Payment reminders
  
- **Messaging**
  - Direct messages to driver
  - View driver responses
  - Message history
  - Emergency contact option

- **Announcements**
  - School/system announcements
  - Holiday schedules
  - Service updates
  - Maintenance notifications

#### Ratings & Feedback
- **Rate Trips**
  - Star rating (1-5 scale)
  - Written feedback/comments
  - Driver performance rating
  - Service quality assessment
  
- **Review History**
  - View submitted reviews
  - Driver responses
  - Rating trends

#### Complaints & Support
- **Submit Complaints**
  - Category selection:
    - Late pickup/drop-off
    - Safety concerns
    - Driver behavior
    - Route issues
    - Payment problems
  - Priority indicators
  - Photo/document upload
  
- **Track Issues**
  - Complaint status
  - Response from admin
  - Resolution timeline
  - Support chat

#### Profile & Settings
- **Account Management**
  - Personal information
  - Contact details
  - Password change
  - Notification preferences
  
- **App Settings**
  - Language selection
  - Map preferences
  - Alert sounds
  - Theme (Light/Dark mode)

---

### 2. Driver User

Drivers manage their routes, log trips, and track performance.

#### Driver Dashboard
- **Today's Overview**
  - Assigned route details
  - Number of students
  - Schedule (pickup/drop-off times)
  - Route status
  - Earnings summary

#### Route Management
- **Route Information**
  - Complete route map
  - All pickup/drop-off locations
  - Student list with photos
  - Parent contact information
  - Navigation integration
  
- **Turn-by-Turn Navigation**
  - GPS-guided navigation
  - Traffic updates
  - Route optimization
  - Alternative route suggestions

#### Trip Operations
- **Start Trip**
  - Begin trip button
  - Pre-trip vehicle checklist
  - Student attendance preview
  - Start GPS tracking
  
- **During Trip**
  - Real-time location broadcasting
  - Mark students as picked up
  - Mark students as dropped off
  - Report delays/issues
  - Emergency button
  
- **End Trip**
  - Complete trip summary
  - Confirm all students delivered
  - Trip duration and distance
  - Automatic earnings calculation

#### Student Tracking
- **Student List**
  - Photos and names
  - Pickup addresses
  - Drop-off addresses
  - Parent contact info
  - Special needs notes
  
- **Attendance Management**
  - Check-in students
  - Mark absent students
  - Note late pickups
  - Photo verification option

#### Communication
- **Parent Messages**
  - Receive parent inquiries
  - Send status updates
  - Emergency notifications
  - Pre-written quick replies
  
- **Admin Notifications**
  - Route changes
  - Schedule updates
  - Performance alerts
  - System announcements

#### Performance Tracking
- **Ratings Overview**
  - Current rating (out of 5)
  - Recent reviews
  - Parent feedback
  - Performance trends
  
- **Trip Statistics**
  - Total trips completed
  - On-time percentage
  - Distance covered
  - Hours logged
  
- **Earnings**
  - Daily earnings
  - Weekly summary
  - Monthly income
  - Payment history
  - Pending payments

#### Vehicle Management
- **Vehicle Information**
  - Bus number and details
  - Capacity
  - License plate
  - Insurance status
  
- **Maintenance**
  - Maintenance schedule
  - Service reminders
  - Report vehicle issues
  - Fuel logging

#### Profile & Settings
- **Driver Profile**
  - Personal information
  - License details
  - Vehicle assignment
  - Emergency contacts
  
- **App Preferences**
  - Navigation app preference
  - Notification settings
  - Language
  - Offline mode

---

## Core Functions

### 1. Authentication & Onboarding

#### Registration Flow
**Parent Registration:**
1. Download app from App Store/Play Store
2. Select "Parent" user type
3. Enter personal information:
   - Full name
   - Email address
   - Phone number
   - Password (secure)
4. Verify email/phone via OTP
5. Add child information
6. Select payment plan
7. Complete profile setup

**Driver Registration:**
1. Download app
2. Select "Driver" user type
3. Enter personal details
4. Upload required documents:
   - Driver's license
   - Vehicle registration
   - Insurance documents
   - Background check
5. Await admin approval
6. Complete training modules
7. Activate account

#### Login
- Email/phone + password
- Biometric authentication (Face ID/Fingerprint)
- Remember me option
- Forgot password recovery
- Social login (optional)

#### Security Features
- End-to-end encryption
- Secure token storage
- Session management
- Auto-logout after inactivity
- Two-factor authentication (optional)

---

### 2. Real-Time GPS Tracking

#### Technology
- **GPS Provider:** Native device GPS
- **Map Integration:** Google Maps API / Apple Maps
- **Update Frequency:** Every 10-30 seconds
- **Accuracy:** Within 10-50 meters

#### Parent View
- **Map Display:**
  - Bus icon showing current location
  - Route line visualization
  - Pickup/drop-off markers
  - Zoom and pan controls
  - Satellite/terrain view options
  
- **Information Panel:**
  - Current bus location
  - Distance to pickup point
  - Estimated arrival time
  - Current speed
  - Last update timestamp

#### Driver View
- **Location Broadcasting:**
  - Automatic GPS updates
  - Location permission required
  - Background tracking enabled
  - Battery optimization alerts
  
- **Route Guidance:**
  - Next stop preview
  - Turn-by-turn directions
  - Distance to next stop
  - Traffic conditions

#### Offline Mode
- Cache last known location
- Queue updates when offline
- Sync when connection restored
- Offline map support

---

### 3. Push Notifications

#### Notification Types

**For Parents:**
- **Trip Alerts:**
  - "Bus is 10 minutes away from pickup"
  - "Your child has been picked up"
  - "Bus approaching drop-off location"
  - "Your child has been dropped off safely"
  
- **Schedule Changes:**
  - Route delays
  - Driver changes
  - Schedule modifications
  - Holiday notices
  
- **Payment Alerts:**
  - Payment due reminders
  - Payment successful
  - Payment failed
  - Balance updates
  
- **Emergency:**
  - Emergency broadcast
  - Safety alerts
  - Weather warnings

**For Drivers:**
- **Trip Reminders:**
  - Upcoming trip notifications
  - Student absence alerts
  - Route changes
  
- **Admin Messages:**
  - Performance feedback
  - Policy updates
  - Training requirements
  
- **System Alerts:**
  - Low rating warnings
  - Maintenance reminders
  - Document expiration

#### Notification Settings
- Enable/disable by category
- Quiet hours scheduling
- Sound and vibration settings
- In-app vs push notification
- Badge count display

---

### 4. Payment Integration

#### Payment Gateway
- **Providers:** Stripe, PayPal, Square
- **Security:** PCI DSS compliant
- **Encryption:** TLS 1.3

#### Payment Plans
- **Weekly:** Pay per week ($50-75)
- **Monthly:** Discounted monthly rate ($200-250)
- **Per-Trip:** Pay as you go (optional)

#### Payment Methods
- Credit/Debit cards
- Digital wallets (Apple Pay, Google Pay)
- Bank account (ACH)
- Cash (driver collection - marked in app)

#### Payment Flow
1. Select payment plan
2. Choose payment method
3. Enter payment details
4. Review amount
5. Confirm payment
6. Receive instant receipt
7. Email/SMS confirmation

#### Auto-Payment
- Set up automatic billing
- Recurring payment schedule
- Payment failure retry logic
- Update payment method

#### Receipt Management
- Digital receipts
- Download PDF
- Email receipts
- Monthly statements

---

### 5. In-App Messaging

#### Message Types
- **Parent-Driver Chat:**
  - Direct messaging
  - Read receipts
  - Typing indicators
  - Message history
  
- **System Messages:**
  - Admin announcements
  - Automated notifications
  - Support responses

#### Features
- **Text Messages:** Plain text with emoji support
- **Media Sharing:** Photos (optional, for reporting issues)
- **Quick Replies:** Pre-written messages
- **Message Status:** Sent, delivered, read
- **Notification Badge:** Unread message count

#### Safety & Moderation
- Message content filtering
- Report inappropriate messages
- Admin monitoring capability
- Block user option

---

### 6. Offline Functionality

#### Cached Data
- Recent trip history (last 30 days)
- Student/route information
- Payment receipts
- Profile information

#### Queue Operations
- Location updates queued
- Messages queued for sending
- Rating submissions stored
- Sync when connection restored

#### Offline Indicators
- Connection status display
- Offline mode banner
- Data sync progress
- Last sync timestamp

---

### 7. Safety Features

#### For Parents
- **Emergency Contact Button:**
  - Quick dial to driver
  - Emergency services contact
  - School contact
  
- **Child Safety:**
  - Photo verification at pickup
  - Drop-off confirmation required
  - Authorized pickup person list
  - Safety alerts

#### For Drivers
- **Emergency Button:**
  - One-tap emergency alert
  - Send location to authorities
  - Alert admin immediately
  - Contact emergency services
  
- **Safety Checklist:**
  - Pre-trip vehicle inspection
  - Student count verification
  - Seat belt checks
  - Emergency equipment check

#### System-Wide
- Background checks for all drivers
- Real-time location tracking
- Trip recording
- Incident reporting
- SOS functionality

---

### 8. Ratings & Reviews System

#### Rating Flow (Parents)
1. Trip completion notification
2. "Rate this trip" prompt
3. Star rating selection (1-5)
4. Optional written review
5. Submit feedback
6. Thank you confirmation

#### Rating Categories
- **Overall Service:** General satisfaction
- **Driver Behavior:** Friendliness, professionalism
- **Timeliness:** On-time pickup/drop-off
- **Safety:** Driving and child safety
- **Communication:** Responsiveness

#### Driver View
- Current average rating
- Recent reviews display
- Review response option
- Rating history graph
- Performance insights

#### Admin Oversight
- Monitor all ratings
- Flag inappropriate reviews
- Identify low-performing drivers
- Quality assurance

---

## Implementation Roadmap

### Phase 1: Foundation (Completed)
- ✅ Expo project setup
- ✅ Basic navigation structure
- ✅ Development environment
- ✅ Initial app configuration

### Phase 2: Authentication (Planned)
- 🔲 Registration screens
- 🔲 Login functionality
- 🔲 Password recovery
- 🔲 User profile setup
- 🔲 Biometric authentication

### Phase 3: Core Features (Planned)
- 🔲 Dashboard screens
- 🔲 Real-time GPS tracking
- 🔲 Map integration
- 🔲 Route visualization
- 🔲 Trip management

### Phase 4: Communication (Planned)
- 🔲 Push notifications
- 🔲 In-app messaging
- 🔲 Announcement system
- 🔲 Alert management

### Phase 5: Payments (Planned)
- 🔲 Payment gateway integration
- 🔲 Payment methods setup
- 🔲 Receipt generation
- 🔲 Payment history
- 🔲 Auto-payment

### Phase 6: Advanced Features (Planned)
- 🔲 Ratings & reviews
- 🔲 Complaint system
- 🔲 Analytics dashboard
- 🔲 Offline mode
- 🔲 Media sharing

### Phase 7: Polish & Launch (Planned)
- 🔲 UI/UX refinements
- 🔲 Performance optimization
- 🔲 Security audit
- 🔲 Beta testing
- 🔲 App Store submission
- 🔲 Play Store submission

---

## Technical Specifications

### Screen Sizes & Responsiveness
- **Phone:** 375x667 to 428x926 (iOS), various Android
- **Tablet:** iPad support enabled
- **Orientation:** Portrait (locked)
- **Safe Areas:** Handled for notch devices

### Performance Requirements
- **App Launch:** < 2 seconds
- **Screen Transitions:** 60 FPS
- **GPS Update:** 10-30 second intervals
- **API Response:** < 1 second
- **Offline Cache:** 50MB max

### Device Requirements
- **iOS:** 13.0+
- **Android:** 8.0+ (API 26)
- **RAM:** 2GB minimum
- **Storage:** 100MB app + data
- **Permissions Required:**
  - Location (Always for drivers, When in use for parents)
  - Notifications
  - Camera (for profile photos)
  - Storage (for receipts)

### API Integration
```javascript
// Backend API Base URL
const API_BASE = 'https://api.edu-ride.com/v1'

// Key Endpoints
- /auth/login
- /auth/register
- /users/profile
- /routes/active
- /trips/current
- /trips/history
- /payments/process
- /ratings/submit
- /notifications/token
- /messages/send
```

### Data Storage
- **Secure Storage:** User credentials, tokens
- **AsyncStorage:** User preferences, cached data
- **File System:** Receipts, documents, images

### Third-Party Services
- **Maps:** Google Maps Platform
- **Payments:** Stripe SDK
- **Analytics:** Firebase Analytics
- **Crash Reporting:** Sentry
- **Push Notifications:** Firebase Cloud Messaging

### Build Configuration
```json
{
  "ios": {
    "bundleIdentifier": "com.eduride.mobile",
    "buildNumber": "1.0.0",
    "supportsTablet": true
  },
  "android": {
    "package": "com.eduride.mobile",
    "versionCode": 1,
    "permissions": [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "NOTIFICATIONS"
    ]
  }
}
```

---

## Screen Inventory

### Parent App Screens

#### Authentication
1. **Splash Screen** - App branding
2. **Welcome Screen** - User type selection
3. **Login Screen** - Email/password login
4. **Register Screen** - New account creation
5. **Forgot Password** - Password recovery
6. **OTP Verification** - Code input screen

#### Main Navigation (Bottom Tabs)
7. **Home/Dashboard** - Overview and quick actions
8. **Track Bus** - Real-time map tracking
9. **Trips** - Trip history and upcoming
10. **Payments** - Payment management
11. **Profile** - Account settings

#### Additional Screens
12. **Child Management** - Add/edit children
13. **Trip Details** - Single trip information
14. **Make Payment** - Payment processing
15. **Payment History** - Past transactions
16. **Messages** - Chat with driver
17. **Notifications** - Notification center
18. **Rate Trip** - Review submission
19. **Submit Complaint** - Issue reporting
20. **Help & Support** - FAQ and contact
21. **Settings** - App preferences
22. **Terms & Privacy** - Legal documents

### Driver App Screens

#### Main Navigation
1. **Driver Dashboard** - Today's overview
2. **Active Trip** - Current trip management
3. **Route Map** - Navigation and route
4. **Students** - Student list
5. **Earnings** - Financial overview
6. **Profile** - Driver settings

#### Additional Screens
7. **Start Trip** - Pre-trip checklist
8. **Student Attendance** - Check-in/out
9. **Trip Summary** - Completed trip details
10. **Trip History** - Past trips
11. **Messages** - Parent communications
12. **Ratings & Reviews** - Performance feedback
13. **Vehicle Info** - Bus details
14. **Report Issue** - Problem reporting
15. **Help & Training** - Resources

---

## App Features Summary

### Total Screen Count
- **Parent App:** ~22 screens
- **Driver App:** ~15 screens

### Key Capabilities
- ✓ Dual user roles (Parent & Driver)
- ✓ Real-time GPS tracking
- ✓ Push notifications
- ✓ In-app payments
- ✓ Messaging system
- ✓ Ratings & reviews
- ✓ Offline functionality
- ✓ Multi-language support
- ✓ Dark mode support
- ✓ Cross-platform (iOS & Android)

### Integration Points
- Backend API (Node.js/Express)
- Payment gateway (Stripe)
- Google Maps API
- Firebase (Notifications, Analytics)
- Push notification service

---

## Development Commands

### Available Scripts
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Run linter
npm run lint

# Reset project
npm run reset-project
```

### Build Commands
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all

# Submit to app stores
eas submit
```

---

## Security Considerations

### Data Protection
- Encryption at rest and in transit
- Secure token storage
- No sensitive data in logs
- Regular security audits

### Privacy Compliance
- GDPR compliant
- COPPA compliant (children's data)
- Clear privacy policy
- User consent management
- Data deletion on request

### Child Safety
- Background-checked drivers only
- Photo verification
- Location sharing controls
- Emergency contacts
- Parental controls

---

## Future Enhancements

### Version 1.1
- [ ] Multi-child tracking on single map
- [ ] Favorite driver feature
- [ ] Trip scheduling in advance
- [ ] Family account sharing

### Version 1.2
- [ ] Voice navigation for drivers
- [ ] AI-powered route optimization
- [ ] Weather integration
- [ ] Carbon footprint tracking

### Version 2.0
- [ ] Video call support
- [ ] Social features (parent community)
- [ ] Gamification for children
- [ ] AR bus tracking
- [ ] Apple Watch/Wear OS support

---

**Last Updated:** January 15, 2026  
**Document Version:** 1.0  
**App Status:** In Development  
**Target Launch:** Q2 2026
