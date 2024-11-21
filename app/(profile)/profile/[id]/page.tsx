'use client';

import { useEffect, useState } from 'react';
import VirtualHugs from '@/components/VirtualHugs';
import RandomAffirmation from '@/components/RandomAffirmation';
import { createClient } from '@/utils/supabase/client';
import { use } from 'react';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the Promise using React.use()
  const { id } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setProfile(data);
        } else if (error) {
          console.error('Error fetching profile:', error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    getProfile();
  }, [id, supabase]);

  return (
    <div className='p-6 space-y-6'>
      {profile && (
        <h1 className='text-2xl font-bold'>
          Welcome, {profile.full_name || 'Friend'}!
        </h1>
      )}
      <RandomAffirmation />
      <VirtualHugs />
    </div>
  );
}
