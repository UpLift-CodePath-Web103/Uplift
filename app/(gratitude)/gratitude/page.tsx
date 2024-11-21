'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import GratitudeHistory from '@/components/GratitudeHistory';
import dynamic from 'next/dynamic';

const supabase = createClient();

// Separate emoji and text for display, but only use text for storage
const GRATITUDE_CATEGORIES = [
  { display: '🏡 Home', value: 'Home' },
  { display: '👨‍👩‍👧‍👦 Family', value: 'Family' },
  { display: '🫂 Friends', value: 'Friends' },
  { display: '💪 Health', value: 'Health' },
  { display: '🎯 Purpose', value: 'Purpose' },
  { display: '📚 Learning', value: 'Learning' },
  { display: '🌱 Growth', value: 'Growth' },
  { display: '🎨 Creativity', value: 'Creativity' },
  { display: '🌞 Nature', value: 'Nature' },
  { display: '✨ Life itself', value: 'Life itself' },
] as const;

interface GratitudeCounts {
  text: string;
  value: number;
}

// Dynamically import D3WordCloud with client-side only rendering
const D3WordCloud = dynamic(() => import('@/components/D3WordCloud'), {
  ssr: false,
  loading: () => (
    <div className='h-64 w-full bg-gray-100 rounded-lg animate-pulse' />
  ),
});

export default function GratitudePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todaysGratitude, setTodaysGratitude] = useState<string | null>(null);
  const [wordCloudData, setWordCloudData] = useState<GratitudeCounts[]>([]);

  // Helper function to get display version of a value
  const getDisplayVersion = (value: string) => {
    return (
      GRATITUDE_CATEGORIES.find((cat) => cat.value === value)?.display || value
    );
  };

  useEffect(() => {
    fetchTodaysGratitude();
    fetchGratitudeCounts();
  }, []);

  const fetchTodaysGratitude = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      const { data, error } = await supabase
        .from('gratitude_entries')
        .select('category')
        .eq('user_id', user.id)
        .eq('entry_date', today)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          // no rows returned
          console.error('Error:', error);
        }
        return;
      }

      setTodaysGratitude(data?.category || null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchGratitudeCounts = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('get_gratitude_counts', {
        user_id_param: user.id,
      });

      if (error) throw error;
      setWordCloudData(
        data.map((item: { text: string; value: number | string }) => ({
          text: item.text,
          value: Number(item.value),
        }))
      );
    } catch (error) {
      console.error('Error fetching gratitude counts:', error);
    }
  };

  const handleGratitude = async (category: string) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Store only the text value, not the emoji
      const { error } = await supabase.from('gratitude_entries').upsert(
        {
          user_id: user.id,
          category,
          entry_date: today,
        },
        {
          onConflict: 'user_id,entry_date',
        }
      );

      if (error) throw error;

      setTodaysGratitude(category);

      // After successful submission, refresh the counts
      await fetchGratitudeCounts();
    } catch (error) {
      console.error('Error submitting gratitude:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='space-y-4'>
        <h1 className='text-2xl font-bold'>What are you grateful for today?</h1>
        {todaysGratitude ? (
          <p className='text-gray-600'>
            Today you're grateful for:{' '}
            <span className='font-medium'>
              {getDisplayVersion(todaysGratitude)}
            </span>
            <br />
            You can change your answer if you'd like.
          </p>
        ) : (
          <p className='text-gray-600'>
            Select something you appreciate in this moment
          </p>
        )}

        <div className='grid grid-cols-2 gap-4 mt-6'>
          {GRATITUDE_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => handleGratitude(category.value)}
              disabled={isSubmitting}
              className={`p-4 rounded-lg border text-left transition-colors
                ${
                  category.value === todaysGratitude
                    ? 'bg-green-50 border-green-200'
                    : 'hover:bg-green-50 hover:border-green-200'
                }
                ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <span className='text-2xl mr-2'>
                {category.display.split(' ')[0]}
              </span>
              <span className='text-gray-700'>
                {category.display.split(' ').slice(1).join(' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Your Gratitude Word Cloud</h2>
        {wordCloudData.length > 0 && <D3WordCloud data={wordCloudData} />}
      </div>

      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Your Gratitude History</h2>
        <GratitudeHistory />
      </div>
    </div>
  );
}
