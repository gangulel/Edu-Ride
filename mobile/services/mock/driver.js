/**
 * Driver-side mock data.
 *
 * One source of truth for every dummy value used by the Driver App while
 * the backend is disconnected. Screens import named exports here instead
 * of declaring inline arrays, so a future Phase 2 backend swap can replace
 * each function with a real API call without screen-level changes.
 *
 * All getters return fresh copies so screen-level mutation (e.g. toggling
 * student status during an active trip) stays scoped to the screen.
 */

const clone = (value) => JSON.parse(JSON.stringify(value));

// ---------------------------------------------------------------------------
// Driver profile + vehicle
// ---------------------------------------------------------------------------

const driverProfileSeed = {
  id: 'drv_001',
  firstName: 'Kasun',
  lastName: 'Perera',
  fullName: 'Kasun Perera',
  initials: 'KP',
  email: 'kasun.perera@eduride.lk',
  phone: '+94 77 123 4567',
  address: '123 Galle Road, Colombo 03',
  emergencyContactName: 'Nimalka Perera',
  emergencyContact: '+94 77 987 6543',
  rating: 4.9,
  totalTrips: 342,
  acceptanceRate: 98,
  yearsActive: 4,
  languages: ['English', 'Sinhala', 'Tamil'],
  avatarUrl: null,
  joinedOn: '2022-08-14',
  isVerified: true,
};

const vehicleSeed = {
  make: 'Toyota',
  model: 'HiAce',
  year: '2022',
  color: 'Pearl White',
  licensePlate: 'CAB-1234',
  vin: '1HGBH41JXMN109186',
  registrationExpiry: '2026-12-31',
  insuranceProvider: 'Ceylinco Insurance',
  insurancePolicy: 'CY-123456789',
  insuranceExpiry: '2026-08-14',
  capacity: '14',
  vehicleType: 'School Van',
  features: ['Air Conditioning', 'Seat Belts', 'First Aid Kit', 'CCTV'],
  inspectionDue: '2026-09-30',
};

export const getDriverProfile = () => clone(driverProfileSeed);
export const getVehicle = () => clone(vehicleSeed);

// ---------------------------------------------------------------------------
// Today's snapshot + earnings periods
// ---------------------------------------------------------------------------

const todaySummary = {
  tripsCompleted: 2,
  studentsServed: 48,
  earnedToday: 12550,
  hoursOnline: 6.5,
};

const earningsByPeriod = {
  today: { total: 12550, trips: 5, hours: 6.5, avgPerTrip: 2510, change: 8.4 },
  week: { total: 68730, trips: 28, hours: 35, avgPerTrip: 2455, change: 12.1 },
  month: { total: 284580, trips: 112, hours: 145, avgPerTrip: 2541, change: 18.7 },
};

const earningsTransactions = [
  { id: 't1', studentName: 'Amaya Perera', amount: 1850, time: '2:30 PM', destination: 'Royal College', tripId: 'trip_009' },
  { id: 't2', studentName: 'Sahan Silva', amount: 2200, time: '1:15 PM', destination: 'Lyceum International', tripId: 'trip_009' },
  { id: 't3', studentName: 'Dilini Fernando', amount: 1500, time: '12:00 PM', destination: 'Visakha Vidyalaya', tripId: 'trip_008' },
  { id: 't4', studentName: 'Roshan Jayawardena', amount: 2800, time: '10:30 AM', destination: 'Royal College', tripId: 'trip_008' },
  { id: 't5', studentName: 'Malini Dissanayake', amount: 1900, time: '9:00 AM', destination: 'Ladies College', tripId: 'trip_007' },
];

export const getTodaySummary = () => clone(todaySummary);
export const getEarningsForPeriod = (period = 'today') =>
  clone(earningsByPeriod[period] ?? earningsByPeriod.today);
export const getEarningsTransactions = () => clone(earningsTransactions);

// ---------------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------------

const nextTripSeed = {
  id: 'trip_010',
  label: 'Morning Route',
  school: 'Royal College, Colombo',
  startTime: '6:45 AM',
  endTime: '8:00 AM',
  studentCount: 24,
  distanceKm: 18.4,
  estimatedDurationMins: 75,
  routeName: 'Colombo South Loop',
  status: 'scheduled',
};

const upcomingTripsSeed = [
  {
    id: 'trip_010',
    label: 'Morning Route',
    school: 'Royal College, Colombo',
    startTime: 'Tomorrow • 6:45 AM',
    studentCount: 24,
    routeName: 'Colombo South Loop',
  },
  {
    id: 'trip_011',
    label: 'Afternoon Drop-off',
    school: 'Royal College, Colombo',
    startTime: 'Tomorrow • 2:15 PM',
    studentCount: 24,
    routeName: 'Colombo South Loop',
  },
  {
    id: 'trip_012',
    label: 'Evening Tuition Run',
    school: 'Sasip Institute',
    startTime: 'Tomorrow • 5:30 PM',
    studentCount: 9,
    routeName: 'Bambalapitiya Shuttle',
  },
];

export const getNextTrip = () => clone(nextTripSeed);
export const getUpcomingTrips = () => clone(upcomingTripsSeed);

// ---------------------------------------------------------------------------
// Active trip + checklist
// ---------------------------------------------------------------------------

const activeTripSeed = {
  id: 'trip_active',
  label: 'Morning Route',
  school: 'Royal College, Colombo',
  routeName: 'Colombo South Loop',
  startedAt: '6:45 AM',
  durationMins: 25,
  distanceKm: 4.2,
  totalDistanceKm: 18.4,
  students: [
    {
      id: 'stu_01',
      name: 'Ashan Perera',
      pickup: '45, Galle Road, Colombo 03',
      pickupTime: '6:45 AM',
      status: 'picked-up',
      parentPhone: '+94 77 123 4567',
    },
    {
      id: 'stu_02',
      name: 'Sithmi Fernando',
      pickup: '12, Duplication Road, Colombo 04',
      pickupTime: '6:50 AM',
      status: 'picked-up',
      parentPhone: '+94 76 234 5678',
    },
    {
      id: 'stu_03',
      name: 'Kavindu Silva',
      pickup: '78, Baseline Road, Colombo 09',
      pickupTime: '7:00 AM',
      status: 'waiting',
      parentPhone: '+94 75 345 6789',
    },
    {
      id: 'stu_04',
      name: 'Nethmi Wickramasinghe',
      pickup: '23, Green Path, Colombo 07',
      pickupTime: '7:10 AM',
      status: 'waiting',
      parentPhone: '+94 74 456 7890',
    },
  ],
};

export const getActiveTrip = () => clone(activeTripSeed);

// ---------------------------------------------------------------------------
// Students roster
// ---------------------------------------------------------------------------

const studentsSeed = [
  {
    id: 'stu_01',
    name: 'Ashan Perera',
    grade: 'Grade 10',
    school: 'Royal College',
    pickupAddress: '45, Galle Road, Colombo 03',
    dropoffAddress: 'Royal College, Colombo 07',
    pickupTime: '6:45 AM',
    parentName: 'Mr. Perera',
    parentPhone: '+94 77 123 4567',
    status: 'active',
    attendance: 95,
    specialNotes: 'Please call 5 minutes before arrival.',
    avatarColor: 'blue',
  },
  {
    id: 'stu_02',
    name: 'Sithmi Fernando',
    grade: 'Grade 8',
    school: 'Royal College',
    pickupAddress: '12, Duplication Road, Colombo 04',
    dropoffAddress: 'Royal College, Colombo 07',
    pickupTime: '6:50 AM',
    parentName: 'Mrs. Fernando',
    parentPhone: '+94 76 234 5678',
    status: 'active',
    attendance: 98,
    specialNotes: 'Pickup from grandmother on Wednesdays.',
    avatarColor: 'emerald',
  },
  {
    id: 'stu_03',
    name: 'Kavindu Silva',
    grade: 'Grade 9',
    school: 'Royal College',
    pickupAddress: '78, Baseline Road, Colombo 09',
    dropoffAddress: 'Royal College, Colombo 07',
    pickupTime: '7:00 AM',
    parentName: 'Mr. Silva',
    parentPhone: '+94 75 345 6789',
    status: 'active',
    attendance: 92,
    specialNotes: '',
    avatarColor: 'amber',
  },
  {
    id: 'stu_04',
    name: 'Nethmi Wickramasinghe',
    grade: 'Grade 7',
    school: 'Royal College',
    pickupAddress: '23, Green Path, Colombo 07',
    dropoffAddress: 'Royal College, Colombo 07',
    pickupTime: '7:10 AM',
    parentName: 'Mrs. Wickramasinghe',
    parentPhone: '+94 74 456 7890',
    status: 'absent',
    attendance: 88,
    specialNotes: 'Out sick this week.',
    avatarColor: 'violet',
  },
  {
    id: 'stu_05',
    name: 'Tharindu Bandara',
    grade: 'Grade 11',
    school: 'Royal College',
    pickupAddress: '54, Marine Drive, Colombo 06',
    dropoffAddress: 'Royal College, Colombo 07',
    pickupTime: '7:20 AM',
    parentName: 'Mr. Bandara',
    parentPhone: '+94 71 567 8901',
    status: 'active',
    attendance: 99,
    specialNotes: 'Carries a violin on Mondays.',
    avatarColor: 'cyan',
  },
];

export const getStudents = () => clone(studentsSeed);

// ---------------------------------------------------------------------------
// Route management
// ---------------------------------------------------------------------------

const routeSeed = {
  id: 'route_001',
  name: 'Colombo South Loop',
  school: 'Royal College',
  schoolArrival: '8:00 AM',
  schoolDeparture: '2:15 PM',
  daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  totalStudents: 24,
  totalDistanceKm: 18.4,
  estimatedDurationMins: 75,
  stops: [
    { id: 's1', location: 'Colombo 07', address: 'Independence Square', pickupTime: '6:45 AM', dropoffTime: '3:30 PM', studentCount: 6 },
    { id: 's2', location: 'Dehiwala', address: 'Galle Road Junction', pickupTime: '7:10 AM', dropoffTime: '3:05 PM', studentCount: 5 },
    { id: 's3', location: 'Bambalapitiya', address: 'Marine Drive', pickupTime: '7:25 AM', dropoffTime: '2:50 PM', studentCount: 7 },
    { id: 's4', location: 'Mount Lavinia', address: 'Hotel Road', pickupTime: '7:40 AM', dropoffTime: '2:35 PM', studentCount: 6 },
  ],
};

export const getRoute = () => clone(routeSeed);

// ---------------------------------------------------------------------------
// Booking requests
// ---------------------------------------------------------------------------

const bookingRequestsSeed = [
  {
    id: 'req_1',
    parentName: 'Mrs. Jayawardena',
    parentInitials: 'MJ',
    parentPhone: '+94 77 888 9999',
    childName: 'Nimesh Jayawardena',
    grade: 'Grade 11',
    school: 'Royal College',
    pickupAddress: '23, Flower Road, Colombo 07',
    dropoffAddress: 'Royal College, Colombo 07',
    requestedDate: '2026-06-01',
    monthlyFee: 'LKR 8,500',
    feeAmount: 8500,
    specialInstructions: 'Please honk twice when arriving.',
    status: 'pending',
    requestedOn: '2 hours ago',
  },
  {
    id: 'req_2',
    parentName: 'Mr. de Silva',
    parentInitials: 'DS',
    parentPhone: '+94 76 777 8888',
    childName: 'Kaveesha de Silva',
    grade: 'Grade 9',
    school: 'Royal College',
    pickupAddress: '15, Green Path, Colombo 03',
    dropoffAddress: 'Royal College, Colombo 07',
    requestedDate: '2026-06-05',
    monthlyFee: 'LKR 9,000',
    feeAmount: 9000,
    specialInstructions: '',
    status: 'pending',
    requestedOn: '1 day ago',
  },
  {
    id: 'req_3',
    parentName: 'Mrs. Karunaratne',
    parentInitials: 'MK',
    parentPhone: '+94 75 666 5555',
    childName: 'Anjana Karunaratne',
    grade: 'Grade 6',
    school: 'Lyceum International',
    pickupAddress: '7, Park Avenue, Colombo 05',
    dropoffAddress: 'Lyceum International, Wattala',
    requestedDate: '2026-06-10',
    monthlyFee: 'LKR 7,800',
    feeAmount: 7800,
    specialInstructions: 'Requires booster seat.',
    status: 'pending',
    requestedOn: '3 days ago',
  },
];

export const getBookingRequests = () => clone(bookingRequestsSeed);

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

const conversationsSeed = [
  {
    id: 'conv_1',
    parentName: 'Mrs. Perera',
    parentInitials: 'MP',
    studentName: 'Ashan Perera',
    lastMessage: 'Thank you! Hope everything is okay.',
    timestamp: '2m ago',
    unread: 2,
    online: true,
    avatarTone: 'blue',
  },
  {
    id: 'conv_2',
    parentName: 'Mr. Silva',
    parentInitials: 'MS',
    studentName: 'Kavindu Silva',
    lastMessage: "I'm running 5 minutes late",
    timestamp: '15m ago',
    unread: 0,
    online: true,
    avatarTone: 'emerald',
  },
  {
    id: 'conv_3',
    parentName: 'Mrs. Fernando',
    parentInitials: 'NF',
    studentName: 'Sithmi Fernando',
    lastMessage: 'See you at the pickup point.',
    timestamp: '1h ago',
    unread: 1,
    online: false,
    avatarTone: 'amber',
  },
  {
    id: 'conv_4',
    parentName: 'Mr. Jayawardena',
    parentInitials: 'RJ',
    studentName: 'Roshan Jayawardena',
    lastMessage: 'Can you pick him up from the library?',
    timestamp: '3h ago',
    unread: 0,
    online: false,
    avatarTone: 'violet',
  },
  {
    id: 'conv_5',
    parentName: 'Mrs. Dissanayake',
    parentInitials: 'MD',
    studentName: 'Malini Dissanayake',
    lastMessage: 'Great ride, thanks!',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    avatarTone: 'cyan',
  },
];

const chatThreads = {
  conv_1: [
    { id: 1, sender: 'parent', text: 'Good morning! Will my child be picked up on time today?', time: '8:30 AM', sent: true },
    { id: 2, sender: 'driver', text: "Good morning Mrs. Perera! Yes, I'll be there at 6:45 AM as usual.", time: '8:32 AM', sent: true },
    { id: 3, sender: 'parent', text: 'Thank you! Also, please note that tomorrow my child will be absent due to a doctor\'s appointment.', time: '8:35 AM', sent: true },
    { id: 4, sender: 'driver', text: 'Noted! Thank you for informing me. Hope everything is okay.', time: '8:36 AM', sent: true },
  ],
  conv_2: [
    { id: 1, sender: 'parent', text: "I'm running 5 minutes late, please wait.", time: '7:14 AM', sent: true },
    { id: 2, sender: 'driver', text: 'No problem, will wait for you.', time: '7:14 AM', sent: true },
  ],
  conv_3: [
    { id: 1, sender: 'driver', text: 'Heading your way now.', time: '6:48 AM', sent: true },
    { id: 2, sender: 'parent', text: 'See you at the pickup point.', time: '6:49 AM', sent: true },
  ],
};

const quickRepliesSeed = [
  'Running 10 minutes late',
  'On my way',
  'Thank you',
  'Will be there soon',
  'Arrived at pickup point',
];

export const getConversations = () => clone(conversationsSeed);
export const getChatThread = (conversationId) => {
  const thread = chatThreads[conversationId] ?? chatThreads.conv_1;
  return clone(thread);
};
export const getConversation = (conversationId) =>
  clone(conversationsSeed.find((c) => c.id === conversationId) ?? conversationsSeed[0]);
export const getQuickReplies = () => clone(quickRepliesSeed);

// ---------------------------------------------------------------------------
// Payment methods + documents
// ---------------------------------------------------------------------------

const paymentMethodsSeed = [
  {
    id: 'pm_1',
    type: 'bank',
    label: 'Commercial Bank',
    detail: '•••• •••• •••• 4242',
    isPrimary: true,
  },
  {
    id: 'pm_2',
    type: 'wallet',
    label: 'eZ Cash Wallet',
    detail: '+94 77 123 4567',
    isPrimary: false,
  },
];

const documentsSeed = [
  { id: 'doc_1', name: 'Driver License', status: 'verified', expiresOn: '2027-04-12', icon: 'card' },
  { id: 'doc_2', name: 'Vehicle Registration', status: 'verified', expiresOn: '2026-12-31', icon: 'document' },
  { id: 'doc_3', name: 'Insurance Certificate', status: 'verified', expiresOn: '2026-08-14', icon: 'shield' },
  { id: 'doc_4', name: 'Police Clearance', status: 'expiring', expiresOn: '2026-07-30', icon: 'security' },
  { id: 'doc_5', name: 'Annual Vehicle Inspection', status: 'pending', expiresOn: null, icon: 'task' },
];

export const getPaymentMethods = () => clone(paymentMethodsSeed);
export const getDocuments = () => clone(documentsSeed);

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

const notificationsSeed = [
  { id: 'n1', title: 'New booking request', body: 'Mrs. Jayawardena requested a ride for Nimesh.', time: '2m ago', unread: true, type: 'request' },
  { id: 'n2', title: 'Payment received', body: 'LKR 2,510 credited to your wallet.', time: '1h ago', unread: true, type: 'payment' },
  { id: 'n3', title: 'Trip reminder', body: 'Morning route starts in 30 minutes.', time: '3h ago', unread: false, type: 'trip' },
];

export const getNotifications = () => clone(notificationsSeed);
export const getUnreadNotificationCount = () =>
  notificationsSeed.filter((n) => n.unread).length;

// ---------------------------------------------------------------------------
// Convenience bundle
// ---------------------------------------------------------------------------

export default {
  getDriverProfile,
  getVehicle,
  getTodaySummary,
  getEarningsForPeriod,
  getEarningsTransactions,
  getNextTrip,
  getUpcomingTrips,
  getActiveTrip,
  getStudents,
  getRoute,
  getBookingRequests,
  getConversations,
  getConversation,
  getChatThread,
  getQuickReplies,
  getPaymentMethods,
  getDocuments,
  getNotifications,
  getUnreadNotificationCount,
};
