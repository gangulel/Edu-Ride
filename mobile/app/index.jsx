import { Redirect } from 'expo-router';

export default function Index() {
  // Check if user has seen onboarding
  const hasSeenOnboarding = false; // Replace with AsyncStorage check
  const isAuthenticated = false; // Replace with auth check
  
  if (!hasSeenOnboarding) {
    return <Redirect href="/welcome" />;
  }
  
  if (!isAuthenticated) {
    return <Redirect href="/role-selection" />;
  }
  
  // Redirect to appropriate home based on user role
  return <Redirect href="/parent/home" />; // or /driver/home
}
