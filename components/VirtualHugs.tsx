'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const supabase = createClient();

interface VirtualHug {
  id: string;
  sender: {
    id: string;
    username: string;
    avatar_url: string;
  };
  message: string;
  created_at: string;
  viewed: boolean;
}

export default function VirtualHugs() {
  const [hugs, setHugs] = useState<VirtualHug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHugs();
    subscribeToHugs();
  }, []);

  const fetchHugs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('virtual_hugs')
        .select('id, created_at')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHugs((data as any) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToHugs = () => {
    const channel = supabase
      .channel('virtual_hugs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'virtual_hugs',
        },
        (payload) => {
          fetchHugs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) return <div>Loading hugs...</div>;

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>Anonymous Virtual Hugs</h2>
      {hugs.length === 0 ? (
        <p>No virtual hugs yet</p>
      ) : (
        <div className='space-y-4'>
          {hugs.map((hug) => (
            <div
              key={hug.id}
              className='p-4 rounded-lg border bg-green-50 border-green-200'
            >
              <div className='flex items-start'>
                <div>
                  <p className='font-medium'>Someone sent you a hug 🤗</p>
                  <p className='text-sm text-gray-500'>
                    {new Date(hug.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
