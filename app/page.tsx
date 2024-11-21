import LoginLogoutButton from '@/components/LoginLogoutButton';
import UserGreetText from '@/components/UserGreetText';
import MoodButton from '@/components/MoodButton';
import Image from 'next/image';
import Link from 'next/link';
import backgroundImage from './backgroundImage.png'; 
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div
      className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]' // Set text color to white
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative', 
      }}
    >
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        {/* Increased text size */}
        <h1 className='text-7xl sm:text-8xl md:text-9xl font-semibold text-center sm:text-left z-10 text-white'>
          Uplift
        </h1>
        
        <div className="absolute top-8 right-8 z-10 text-black space-x-5">
          <LoginLogoutButton />
          <Button><Link href={'/journal'}>Dashboard</Link></Button>

        </div>
      </main>
    </div>
  );
}

