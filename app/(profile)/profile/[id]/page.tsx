'use client';

import { useEffect, useState } from 'react';
import VirtualHugs from '@/components/VirtualHugs';
import RandomAffirmation from '@/components/RandomAffirmation';
import { createClient } from '@/utils/supabase/client';

export default function ProfilePage({ params }: { params: { id: string } }) {
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
          .eq('id', params.id)
          .single();

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    getProfile();
  }, [params.id]);

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
