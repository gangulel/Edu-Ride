# Edu-Ride Frontend Functions Documentation

**Project:** Edu-Ride Bus Tracking System  
**Generated:** January 15, 2026  
**Frontend Platforms:** Admin Web Dashboard, Mobile App

---

## Table of Contents
1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Core Features & Functions](#core-features--functions)
3. [Mobile App Overview](#mobile-app-overview)
4. [Technology Stack](#technology-stack)

---

## Admin Dashboard Overview

The admin dashboard is a comprehensive web-based interface built with **React**, **TypeScript**, and **Vite**. It provides administrators with complete control over the bus tracking system.

### Architecture
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **UI Components:** Shadcn/ui component library
- **Charts:** Recharts library for data visualization
- **Icons:** Lucide React icons

---

## Core Features & Functions

### 1. Dashboard Overview (`DashboardOverview.tsx`)

**Purpose:** Central hub displaying real-time system metrics and insights.

**Key Functions:**
- **Statistics Display:**
  - Total parents count (1,254 users) with growth percentage
  - Total drivers count (381 users) with growth percentage
  - Active routes monitoring (156 routes)
  - Monthly revenue tracking ($65,000)

- **Data Visualization:**
  - Monthly transactions bar chart
  - Revenue trends over 6 months
  - User status distribution (pie chart showing active/pending/suspended)

- **Real-time Alerts:**
  - Parent complaints monitoring
  - Payment failure detection
  - Driver verification status
  - Route overlap warnings

**Data Displayed:**
```javascript
- Monthly transaction data (Jan-Jun)
- Status distribution (Active: 324, Pending: 45, Suspended: 12)
- Priority-based alert system
```

---

### 2. User Management (`UserManagement.tsx`)

**Purpose:** Comprehensive user administration for parents and drivers.

**Key Functions:**

#### Parent Management
- **Search & Filter:**
  - Search by name, email, or phone number
  - Filter by status (active, pending, suspended)

- **Parent Statistics:**
  - Total parents: 1,254
  - Active: 1,187
  - Pending verification: 33
  - Suspended: 34

- **Parent Information Display:**
  - Name, email, phone
  - Number of children enrolled
  - Account status
  - Join date
  - Complaint history

- **Actions:**
  - View detailed parent profile
  - Suspend/activate accounts
  - Verify pending registrations

#### Driver Management
- **Driver Statistics:**
  - Total, active, pending, and suspended drivers
  
- **Driver Information Display:**
  - Name, email, phone
  - Assigned vehicle
  - Route assignment
  - Rating (out of 5)
  - Total trips completed

- **Actions:**
  - View driver details
  - Approve/suspend drivers
  - Manage verification status

---

### 3. Route & Bus Management (`RouteManagement.tsx`)

**Purpose:** Manage bus routes, schedules, and monitor efficiency.

**Key Functions:**

- **Route Statistics:**
  - Total routes: 156
  - Active routes: 142 (91%)
  - Total students across all routes: 4,234
  - Route overlaps detected: 7 conflicts

- **Route Information:**
  - Route name and ID
  - Assigned driver and vehicle
  - Towns covered
  - Number of students
  - Schedule (pickup/drop-off times)
  - Status (active/inactive)
  - Overlap detection

- **Route Operations:**
  - Add new routes
  - View route details on map
  - Detect scheduling conflicts
  - Monitor route efficiency
  - Search routes by name, driver, or town

**Sample Route Data:**
```javascript
Route A: Downtown → Riverside → Oakwood
- Driver: Robert Martinez
- Vehicle: Bus-101
- Students: 28
- Schedule: 7:00 AM - 8:30 AM
```

---

### 4. Payment & Transaction Management (`PaymentManagement.tsx`)

**Purpose:** Complete financial oversight and payment processing.

**Key Functions:**

- **Revenue Metrics:**
  - Total revenue: $65,000/month
  - Successful payments: 5,842 (96.8% success rate)
  - Failed payments: 193 (3.2% failure rate)
  - Platform commission: $3,250 (5% of revenue)

- **Payment Tracking:**
  - Transaction ID tracking
  - Parent-driver payment history
  - Payment status (paid/pending/failed)
  - Payment types (monthly/weekly)
  - Date and amount tracking

- **Financial Analytics:**
  - Monthly revenue line charts
  - Commission tracking
  - Payment trend analysis
  - Transaction volume monitoring

- **Operations:**
  - Export financial reports
  - Filter by date, status, type
  - Payment reconciliation
  - Refund processing

---

### 5. Ratings & Reviews (`RatingsReviews.tsx`)

**Purpose:** Quality monitoring and driver performance tracking.

**Key Functions:**

- **Rating Metrics:**
  - System-wide average rating: 4.6/5.0
  - Total reviews: 1,156
  - Low-rated drivers: 23 (below 3.5)
  - Flagged reviews: 18 pending moderation

- **Driver Performance:**
  - Individual driver ratings
  - Total reviews per driver
  - Number of low ratings
  - Flagged reviews count
  - Monthly average comparison

- **Review Management:**
  - View parent reviews and comments
  - Flag inappropriate content
  - Monitor rating trends
  - Identify underperforming drivers

- **Analytics:**
  - Performance by route (bar chart)
  - Rating distribution
  - Review sentiment analysis
  - Trend monitoring

**Performance Tracking:**
```javascript
Top Driver: Linda Anderson - 4.9/5 (312 reviews)
Needs Attention: David Brown - 3.2/5 (145 reviews, 12 flagged)
```

---

### 6. Communication Management (`CommunicationManagement.tsx`)

**Purpose:** System-wide notification and announcement management.

**Key Functions:**

- **Notification Statistics:**
  - Total sent: 1,248 notifications/month
  - Delivery rate: 98.5%
  - Emergency alerts: 12 sent this month
  - Active templates: 24 ready to use

- **Notification Types:**
  - System announcements
  - Emergency alerts
  - Route delay notifications
  - Payment reminders
  - Holiday notices

- **Target Audiences:**
  - All users
  - All parents
  - All drivers
  - Specific routes
  - Individual users

- **Template Management:**
  - Pre-built message templates
  - Categories: Emergency, Alert, Payment, Announcement
  - Template usage tracking
  - Custom template creation

- **Operations:**
  - Send instant notifications
  - Schedule announcements
  - Track delivery status
  - Monitor engagement

**Template Examples:**
- Weather Alert
- Route Delay
- Payment Reminder
- Holiday Notice

---

### 7. Complaints & Support Management (`ComplaintsSupport.tsx`)

**Purpose:** Track and resolve user complaints and support tickets.

**Key Functions:**

- **Complaint Statistics:**
  - Total complaints: 248/month
  - Open tickets: 42
  - Resolved: 198 (79.8% resolution rate)
  - High priority: 8 requiring immediate attention

- **Complaint Categories:**
  - Late pickup
  - Safety concerns
  - Payment issues
  - Route problems
  - Vehicle problems

- **Priority Levels:**
  - High (immediate attention)
  - Medium (within 24 hours)
  - Low (within 48 hours)

- **Ticket Management:**
  - Complaint ID tracking
  - User information (parent/driver)
  - Category and priority
  - Status (open/in-progress/resolved)
  - Assignment to admin staff
  - Response history

- **Operations:**
  - Search complaints by ID or user
  - Filter by category and priority
  - Assign to administrators
  - Track resolution time
  - View complaint details and history

**Sample Workflow:**
```
COMP-001 → Sarah Johnson → Late Pickup → High Priority → Open
Assigned to: Admin Team
```

---

### 8. Reports & Analytics (`ReportsAnalytics.tsx`)

**Purpose:** Comprehensive data analysis and business intelligence.

**Key Functions:**

- **Key Performance Indicators:**
  - Total users: 1,635 (+10.5% growth)
  - Total revenue: $330K (6 months)
  - System average rating: 4.6/5
  - Route utilization metrics

- **User Growth Analytics:**
  - Parent registration trends (Jan-Jun)
  - Driver onboarding trends
  - Month-over-month growth rates
  - User retention metrics

- **Route Utilization:**
  - Route capacity vs actual usage
  - Students per route
  - Utilization percentages
  - Route efficiency scores

- **Payment Trends:**
  - Revenue per month
  - Transaction volumes
  - Average transaction value
  - Payment method distribution

- **Driver Performance:**
  - Rating comparisons
  - Total trips completed
  - On-time percentage
  - Performance rankings

- **Reporting Features:**
  - Date range selection (monthly/quarterly/yearly)
  - Export all reports
  - Custom report generation
  - Data visualization (charts, graphs)

**Analytics Visualization:**
- Line charts for growth trends
- Bar charts for route utilization
- Area charts for revenue
- Performance comparison tables

---

### 9. System Settings (`SystemSettings.tsx`)

**Purpose:** Configure platform-wide settings and preferences.

**Key Functions:**

#### Platform Settings
- **Language Configuration:**
  - Multiple language support (English, Spanish, French, German)
  
- **Regional Settings:**
  - Timezone configuration (EST, CST, MST, PST)
  - Date format preferences
  - Currency settings (USD, EUR, GBP)

#### Payment Gateway
- **Provider Configuration:**
  - Stripe
  - PayPal
  - Square

- **Commission Settings:**
  - Platform commission rate (default 5%)
  - Payment processing fees
  - Payout schedules

#### Feature Toggles
- **Real-time Tracking:** GPS tracking for buses (enabled)
- **Payment Reminders:** Automated notifications (enabled)
- **Emergency Alerts:** Broadcast system (enabled)
- **Driver Chat:** In-app messaging (disabled)
- **Route Optimization:** AI-powered suggestions (enabled)
- **Maintenance Alerts:** Vehicle reminders (disabled)

#### Mobile App Settings
- **Push Notifications:** Configuration for iOS/Android
- **App Version Management:** Force update controls
- **Feature Flags:** Enable/disable mobile features

---

### 10. Audit Logs & Security (`AuditLogs.tsx`)

**Purpose:** Security monitoring and activity tracking.

**Key Functions:**

- **Security Metrics:**
  - Total logins: 1,842 (last 30 days)
  - Failed attempts: 23
  - Admin actions: 387/month
  - Security alerts: 5 active investigations

- **Login History:**
  - User email and role
  - Login action and status
  - IP address tracking
  - Geographic location
  - Timestamp logging

- **Admin Action Logs:**
  - Administrator name
  - Action performed (suspend, approve, update, etc.)
  - Target user/entity
  - Action details
  - Timestamp
  - Severity level (high/medium/low)

- **Suspicious Activity Detection:**
  - Multiple failed login attempts
  - Unusual payment patterns
  - Rapid account creation from same IP
  - Unauthorized access attempts

- **Security Features:**
  - Real-time monitoring
  - Automated threat detection
  - Activity status tracking (investigating/resolved/blocked)
  - Export security logs

**Tracked Actions:**
```javascript
- User suspensions
- Payment setting updates
- Notification broadcasts
- Driver approvals
- Admin account creation
```

---

### 11. Content Management (`ContentManagement.tsx`)

**Purpose:** Manage legal documents and help content.

**Key Functions:**

#### Legal Documents
- **Terms & Conditions Editor:**
  - Version control (current: 2.1)
  - Last updated tracking
  - Full text editor
  - Publish/preview functionality
  - View change history

- **Privacy Policy Editor:**
  - GDPR compliance content
  - Data collection details
  - Usage policies
  - Security measures documentation
  - Version management

#### FAQ Management
- **Question Categories:**
  - Getting Started
  - Tracking
  - Payments
  - Support

- **FAQ Operations:**
  - Add/edit/delete questions
  - Organize by category
  - Search functionality
  - Order management

**Sample FAQs:**
1. How do I register as a parent?
2. How do I track my child's bus?
3. What payment methods are accepted?
4. How do I report a problem?

#### Help Content
- Tutorial creation
- User guide management
- Support documentation
- In-app help system

---

## Mobile App Overview

### Current Implementation
The mobile app is built using **React Native** with **Expo** framework.

**Platform:** Cross-platform (iOS & Android)

### Structure
```
mobile/
├── app/
│   ├── _layout.jsx    # Root navigation layout
│   ├── index.jsx      # Home screen
│   └── trips/         # Trip management (planned)
└── services/          # API and service integrations
```

### Current Features
- **Basic App Shell:** Running with Expo Router
- **Home Screen:** Welcome/landing page

### Planned Mobile Functions
Based on the admin dashboard, the mobile app will include:

#### For Parents:
1. **Real-time Bus Tracking**
   - Live GPS location of assigned bus
   - Estimated arrival time
   - Route visualization on map

2. **Child Management**
   - Add multiple children
   - Assign to routes
   - View pickup/drop-off times

3. **Payment Processing**
   - View payment history
   - Make payments (monthly/weekly)
   - Payment reminders
   - Receipt management

4. **Ratings & Reviews**
   - Rate driver service
   - Leave feedback
   - View driver ratings

5. **Notifications**
   - Push notifications for delays
   - Emergency alerts
   - Payment reminders
   - System announcements

6. **Complaints**
   - Submit complaints
   - Track complaint status
   - Chat with support

#### For Drivers:
1. **Route Management**
   - View assigned route
   - Student list with pickup/drop-off locations
   - Navigation assistance

2. **Trip Logging**
   - Start/end trip
   - Mark student pickups/drop-offs
   - Report delays

3. **Communication**
   - Receive admin notifications
   - View parent messages
   - Emergency broadcast reception

4. **Performance**
   - View ratings and reviews
   - Trip history
   - Earnings tracking

---

## Technology Stack

### Admin Dashboard
```json
{
  "framework": "React 18",
  "language": "TypeScript",
  "build": "Vite",
  "ui": "Shadcn/ui",
  "charts": "Recharts",
  "icons": "Lucide React",
  "styling": "Tailwind CSS"
}
```

### UI Component Library
The admin dashboard uses a comprehensive set of Shadcn/ui components:
- **Layout:** Card, Tabs, Dialog, Sheet, Sidebar
- **Forms:** Input, Textarea, Select, Checkbox, Radio, Switch
- **Data:** Table, Badge, Separator
- **Feedback:** Alert, Toast (Sonner), Progress
- **Navigation:** Breadcrumb, Pagination, Navigation Menu
- **Overlay:** Dialog, Drawer, Popover, Tooltip, Dropdown Menu
- **Charts:** Custom chart components

### Mobile App
```json
{
  "framework": "React Native",
  "router": "Expo Router",
  "platform": "Expo",
  "language": "JavaScript/TypeScript",
  "navigation": "File-based routing"
}
```

---

## Summary Statistics

### Admin Dashboard Modules: 11
1. Dashboard Overview
2. User Management
3. Route & Bus Management
4. Payment Management
5. Ratings & Reviews
6. Communication Management
7. Complaints & Support
8. Reports & Analytics
9. System Settings
10. Audit Logs
11. Content Management

### Key Metrics Tracked:
- **Users:** 1,635 total (1,254 parents, 381 drivers)
- **Routes:** 156 active routes
- **Revenue:** $65,000/month
- **Payments:** 5,842 successful transactions/month
- **Rating:** 4.6/5 system average
- **Complaints:** 248/month with 79.8% resolution rate

### Total UI Components: 40+
Including buttons, cards, tables, forms, charts, dialogs, and more.

---

## Development Status

### Completed ✅
- Admin dashboard with full functionality
- All 11 management modules
- Data visualization and analytics
- User interface components
- Responsive design

### In Progress 🚧
- Mobile app implementation
- API integration with backend
- Real-time tracking features

### Planned 📋
- Parent mobile app features
- Driver mobile app features
- Real-time GPS tracking
- Push notification system
- In-app chat functionality

---

**Last Updated:** January 15, 2026  
**Document Version:** 1.0
