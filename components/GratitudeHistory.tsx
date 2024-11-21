'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface GratitudeEntry {
  id: string;
  category: string;
  created_at: string;
}

export default function GratitudeHistory() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
    subscribeToEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gratitude_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToEntries = () => {
    const channel = supabase
      .channel('gratitude_entries')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gratitude_entries',
        },
        (payload) => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='space-y-4'>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className='p-4 rounded-lg border bg-green-50 border-green-200'
        >
          <div className='flex items-start'>
            <div>
              <p className='font-medium'>{entry.category}</p>
              <p className='text-sm text-gray-500'>
                {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
