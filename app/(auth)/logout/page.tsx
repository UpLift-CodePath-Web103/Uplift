'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 2000);
    return () => clearTimeout(timer); // Clean up the timer to avoid memory leaks
  }, [router]); // Include `router` in the dependency array
  return <div>You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;