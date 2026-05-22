# Edu-Ride Mobile App - Atomic Design Component System

## Overview

This document describes the component architecture following **Atomic Design** methodology for the Edu-Ride mobile application.

## Directory Structure

```
mobile/app/components/
├── atoms/           # Basic building blocks
├── molecules/       # Combinations of atoms
├── organisms/       # Complex components
├── templates/       # Page layouts
└── index.js         # Main export file
```

---

## 🔵 Atoms (Basic Building Blocks)

| Component | Description | Props |
|-----------|-------------|-------|
| **Button** | Customizable button | `title`, `variant`, `size`, `loading`, `disabled`, `icon` |
| **Badge** | Status/count indicator | `label`, `variant`, `size`, `dot` |
| **Avatar** | User profile image | `source`, `name`, `size`, `verified`, `showBadge` |
| **Card** | Container component | `onPress`, `variant`, `padding` |
| **Input** | Text input field | `label`, `error`, `leftIcon`, `rightIcon`, `secureTextEntry` |
| **RatingStars** | Star rating display/input | `rating`, `interactive`, `size`, `onRatingChange` |
| **Divider** | Visual separator | `text`, `orientation`, `spacing` |
| **Spinner** | Loading indicator | `size`, `text`, `overlay` |
| **Icon** | Ionicons wrapper | `name`, `size`, `color`, `background` |
| **Text** | Typography component | `variant`, `weight`, `color`, `align` |

### Usage Example
```jsx
import { Button, Badge, Avatar } from '../components/atoms';

<Button title="Submit" variant="primary" onPress={handleSubmit} />
<Badge label="Active" variant="success" />
<Avatar name="John Doe" size="large" verified />
```

---

## 🟢 Molecules (Atom Combinations)

| Component | Description | Uses |
|-----------|-------------|------|
| **SearchBar** | Search input with filter | Input, Icon |
| **ServiceCard** | Bus service display | Avatar, Badge, RatingStars, Card |
| **SubscriptionCard** | Active subscription | Avatar, Badge, Card, Button |
| **ReviewCard** | User review display | Avatar, RatingStars, Card |
| **ChildCard** | Child information | Avatar, Badge, Card |
| **NotificationItem** | Notification row | Avatar, Badge, Icon |
| **MessagePreview** | Chat preview | Avatar, Badge |
| **FilterChip** | Filter toggle button | Icon |
| **PaymentMethodCard** | Payment method | Icon, Card, Badge |
| **LocationInput** | Address input | Input, Icon |
| **StatCard** | Statistics display | Card, Icon |
| **EmptyState** | Empty content | Icon, Button |

### Usage Example
```jsx
import { ServiceCard, ChildCard } from '../components/molecules';

<ServiceCard 
  driver={driverData}
  onPress={() => navigateToDetail()}
  variant="compact"
/>
```

---

## 🟠 Organisms (Complex Components)

| Component | Description | Uses |
|-----------|-------------|------|
| **Header** | Page header with nav | Avatar, Badge, Icon |
| **ParentBottomNav** | Bottom tab navigation | Icon |
| **ServiceList** | List of services | ServiceCard, EmptyState, Spinner |
| **ScheduleTimeline** | Route schedule | Card, Icon |
| **FilterModal** | Search filters | FilterChip, Button |
| **BookingForm** | Booking request form | Input, Button, LocationInput |
| **ReviewForm** | Review submission | RatingStars, Input, Button |

### Usage Example
```jsx
import { Header, ParentBottomNav, ServiceList } from '../components/organisms';

<Header title="Search" showBack showNotification />
<ServiceList services={data} onServicePress={handlePress} />
<ParentBottomNav />
```

---

## 🟣 Templates (Page Layouts)

| Component | Description |
|-----------|-------------|
| **ScreenTemplate** | Base screen wrapper with SafeAreaView |
| **TabScreenTemplate** | Screen with bottom navigation |

---

## 📱 Parent App Screens

| Screen | Route | Description |
|--------|-------|-------------|
| **Home** | `/parent` | Dashboard with stats, subscriptions |
| **Search** | `/parent/search` | Service discovery |
| **Service Detail** | `/parent/service-detail` | Driver profile, schedule, reviews |
| **Booking** | `/parent/booking` | Booking request form |
| **My Bookings** | `/parent/my-bookings` | Active/pending/past subscriptions |
| **Payments** | `/parent/payments` | Payment history, methods |
| **Add Payment** | `/parent/add-payment` | Add new card |
| **Messages** | `/parent/messages` | Conversation list |
| **Chat** | `/parent/chat` | Individual chat |
| **Notifications** | `/parent/notifications` | All notifications |
| **Write Review** | `/parent/write-review` | Submit review |
| **Profile** | `/parent/profile` | User settings |
| **Edit Profile** | `/parent/profile/edit` | Update user info |
| **Children** | `/parent/profile/children` | Manage children |
| **Add Child** | `/parent/profile/add-child` | Add new child |

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#007AFF` | Action buttons, links |
| Success Green | `#34C759` | Success states |
| Warning Orange | `#FF9500` | Warnings, pending |
| Danger Red | `#FF3B30` | Errors, delete |
| Purple | `#5856D6` | Info badges |
| Background | `#F2F2F7` | Screen backgrounds |
| White | `#FFFFFF` | Cards, inputs |
| Gray Text | `#8E8E93` | Secondary text |
| Border | `#E5E5EA` | Dividers |

---

## Typography

| Variant | Size | Weight | Use Case |
|---------|------|--------|----------|
| heading | 24px | bold | Page titles |
| subheading | 20px | semibold | Section titles |
| body | 16px | regular | Body text |
| caption | 14px | regular | Helper text |
| label | 12px | medium | Form labels |

---

## Best Practices

1. **Always import from index files** for cleaner imports
2. **Follow naming conventions** - PascalCase for components
3. **Use responsive utilities** (`wp`, `hp`, `fs`, `responsive`)
4. **Keep atoms stateless** when possible
5. **Compose molecules from atoms** - don't skip levels
6. **Test components in isolation** before integration

---

*Generated: January 24, 2026*
