import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding screen on app open
    router.replace('/onboarding');
  }, []);

  return null;
}
