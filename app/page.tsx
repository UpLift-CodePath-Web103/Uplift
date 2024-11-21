import LoginLogoutButton from '@/components/LoginLogoutButton';
import UserGreetText from '@/components/UserGreetText';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div
      className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]' // Set text color to white
    >
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        {/* Increased text size */}
        <h1 className='text-7xl sm:text-8xl md:text-9xl font-semibold text-center sm:text-left z-10 text-black'>
          Uplift
        </h1>
        <h2 className='text-5xl sm:text-6xl md:text-7xl font-semibold text-center sm:text-left z-10 text-black'>
          <UserGreetText />
        </h2>
        <Button><Link href={'/journal'}>Dashboard</Link></Button>
        <div className="absolute top-8 right-8 z-10 text-black space-x-5">
          <LoginLogoutButton />
        </div>
      </main>
    </div>
  );
}

