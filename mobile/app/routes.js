/**
 * Edu-Ride Mobile App Routes
 * 
 * This file contains all route definitions for the mobile application.
 * Routes are organized by user role and feature area.
 */

// ============================================
// AUTH ROUTES
// ============================================
export const AUTH_ROUTES = {
    LOGIN: '/login/login',
    REGISTER: '/login/register',
    FORGOT_PASSWORD: '/login/forgot',
};

// ============================================
// ONBOARDING ROUTES
// ============================================
export const ONBOARDING_ROUTES = {
    WELCOME: '/',
    ONBOARDING: '/onboarding',
};

// ============================================
// PARENT ROUTES
// ============================================
export const PARENT_ROUTES = {
    // Main screens
    HOME: '/parent',
    SEARCH: '/parent/search',
    MY_BOOKINGS: '/parent/my-bookings',
    MESSAGES: '/parent/messages',
    PROFILE: '/parent/profile',

    // Service & Booking
    SERVICE_DETAIL: '/parent/service-detail',
    BOOKING: '/parent/booking',

    // Payments
    PAYMENTS: '/parent/payments',
    ADD_PAYMENT: '/parent/add-payment',

    // Communication
    CHAT: '/parent/chat',
    NOTIFICATIONS: '/parent/notifications',

    // Reviews
    WRITE_REVIEW: '/parent/write-review',

    // Profile sub-routes
    EDIT_PROFILE: '/parent/profile/edit',
    CHILDREN: '/parent/profile/children',
    ADD_CHILD: '/parent/profile/add-child',
};

// ============================================
// DRIVER ROUTES
// ============================================
export const DRIVER_ROUTES = {
    // Main screens
    HOME: '/driver',
    ROUTE_MANAGEMENT: '/driver/route-management',
    STUDENTS: '/driver/students',
    BOOKING_REQUESTS: '/driver/booking-requests',
    ACTIVE_TRIP: '/driver/active-trip',

    // Earnings & History
    EARNINGS: '/driver/earnings',
    RIDES: '/driver/rides',

    // Communication
    MESSAGES: '/driver/messages',
    CHAT: '/driver/chat',

    // Profile
    PROFILE: '/driver/Profile',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate service detail route with ID
 * @param {string|number} serviceId - The service/driver ID
 * @returns {string} Full route path
 */
export const getServiceDetailRoute = (serviceId) => {
    return `/parent/service-detail?id=${serviceId}`;
};

/**
 * Generate booking route with driver ID
 * @param {string|number} driverId - The driver ID
 * @returns {string} Full route path
 */
export const getBookingRoute = (driverId) => {
    return `/parent/booking?driverId=${driverId}`;
};

/**
 * Generate chat route with participant info
 * @param {string|number} participantId - The driver/parent ID
 * @param {string} participantName - Display name
 * @returns {string} Full route path
 */
export const getChatRoute = (participantId, participantName) => {
    return `/parent/chat?driverId=${participantId}&name=${encodeURIComponent(participantName)}`;
};

/**
 * Generate driver chat route
 * @param {string|number} parentId - The parent ID
 * @param {string} parentName - Display name
 * @returns {string} Full route path
 */
export const getDriverChatRoute = (parentId, parentName) => {
    return `/driver/chat?parentId=${parentId}&name=${encodeURIComponent(parentName)}`;
};

// ============================================
// ROUTE GROUPS (for navigation menus)
// ============================================

export const PARENT_TAB_ROUTES = [
    { name: 'Home', route: PARENT_ROUTES.HOME, icon: 'home', iconActive: 'home' },
    { name: 'Search', route: PARENT_ROUTES.SEARCH, icon: 'search-outline', iconActive: 'search' },
    { name: 'Bookings', route: PARENT_ROUTES.MY_BOOKINGS, icon: 'calendar-outline', iconActive: 'calendar' },
    { name: 'Messages', route: PARENT_ROUTES.MESSAGES, icon: 'chatbubble-outline', iconActive: 'chatbubble' },
    { name: 'Profile', route: PARENT_ROUTES.PROFILE, icon: 'person-outline', iconActive: 'person' },
];

export const DRIVER_TAB_ROUTES = [
    { name: 'Home', route: DRIVER_ROUTES.HOME, icon: 'home', iconActive: 'home' },
    { name: 'Routes', route: DRIVER_ROUTES.ROUTE_MANAGEMENT, icon: 'map-outline', iconActive: 'map' },
    { name: 'Students', route: DRIVER_ROUTES.STUDENTS, icon: 'people-outline', iconActive: 'people' },
    { name: 'Earnings', route: DRIVER_ROUTES.EARNINGS, icon: 'wallet-outline', iconActive: 'wallet' },
    { name: 'Profile', route: DRIVER_ROUTES.PROFILE, icon: 'person-outline', iconActive: 'person' },
];

// ============================================
// ALL ROUTES (for reference)
// ============================================

export const ALL_ROUTES = {
    ...ONBOARDING_ROUTES,
    ...AUTH_ROUTES,
    PARENT: PARENT_ROUTES,
    DRIVER: DRIVER_ROUTES,
};

export default ALL_ROUTES;
