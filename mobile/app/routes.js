/**
 * Centralized route definitions for Edu-Ride mobile app
 * Use these constants throughout the app for type-safe navigation
 */

export const ROUTES = {
  // Root routes
  INDEX: '/',
  ONBOARDING: '/onboarding',
  
  // Authentication routes
  LOGIN: '/login/login',
  REGISTER: '/login/register',
  FORGOT_PASSWORD: '/login/forgot',
  
  // Student routes
  HOME: '/home',
  STUDENT_HOME: '/home/index',
  
  // Driver routes
  DRIVER: '/driver',
  DRIVER_HOME: '/driver/index',
  DRIVER_RIDES: '/driver/rides',
  DRIVER_EARNINGS: '/driver/earnings',
  DRIVER_PROFILE: '/driver/profile',
  
  // Trips routes
  TRIPS: '/trips',
};

/**
 * Navigation helper functions
 */
export const navigationHelpers = {
  /**
   * Get the appropriate home screen based on user role
   * @param {string} role - User role ('student' or 'driver')
   * @returns {string} Route path
   */
  getHomeByRole: (role) => {
    return role === 'driver' ? ROUTES.DRIVER_HOME : ROUTES.STUDENT_HOME;
  },
  
  /**
   * Check if the current route is a driver route
   * @param {string} pathname - Current pathname
   * @returns {boolean}
   */
  isDriverRoute: (pathname) => {
    return pathname.startsWith('/driver');
  },
  
  /**
   * Check if the current route is a student route
   * @param {string} pathname - Current pathname
   * @returns {boolean}
   */
  isStudentRoute: (pathname) => {
    return pathname.startsWith('/home');
  },
  
  /**
   * Check if the current route requires authentication
   * @param {string} pathname - Current pathname
   * @returns {boolean}
   */
  requiresAuth: (pathname) => {
    const publicRoutes = [ROUTES.INDEX, ROUTES.ONBOARDING, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD];
    return !publicRoutes.includes(pathname);
  },
};

export default ROUTES;
