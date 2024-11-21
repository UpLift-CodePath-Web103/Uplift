'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

const supabase = createClient();

export function NavBar() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    getUser();
  }, []);

  return (
    <aside className='w-64 pr-8'>
      <h1 className='text-2xl font-bold mb-4'>UpLift</h1>

      <Link href='/journal/new'>
        <h3 className='mb-2 text-blue-600 hover:underline'>
          Create Journal Entry
        </h3>
      </Link>

      <Link href='/story/new'>
        <h3 className='mb-2 text-blue-600 hover:underline'>Share Story</h3>
      </Link>

      <Link href='/mood'>
        <h3 className='mb-2 text-blue-600 hover:underline'>Share Mood</h3>
      </Link>

      <ul className='space-y-2'>
        {userId && (
          <li>
            <Link
              href={`/profile/${userId}`}
              className='text-blue-600 hover:underline'
            >
              My Profile
            </Link>
          </li>
        )}
        <li>
          <Link href='/story' className='text-blue-600 hover:underline'>
            View Stories
          </Link>
        </li>
        <li>
          <Link href='/journal' className='text-blue-600 hover:underline'>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href='/breathe' className='text-blue-600 hover:underline'>
            Breathing Exercises
          </Link>
        </li>
        <li>Motivation</li>
        <li>History</li>
        <li>
          <Link href='/' className='text-blue-600 hover:underline'>
            Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}
