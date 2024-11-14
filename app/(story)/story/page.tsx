'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const supabase = createClient();

interface Story {
  story_id: number;
  created_at: string;
  text: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('user_story')
        .select('story_id, created_at, text')
        .gte(
          'created_at',
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      setStories(data || []);
      setLoading(false);
    };

    fetchStories();

    // Set up real-time subscription
    const channel = supabase
      .channel('stories_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_story',
        },
        () => {
          fetchStories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hours ago`;
    }
    return '1 day ago';
  };

  if (loading) {
    return <div className='p-6'>Loading stories...</div>;
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Anonymous Stories</h1>
        <Link href='/story/new'>
          <Button>Share Your Story</Button>
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-gray-500'>
            No stories shared in the last 24 hours.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {stories.map((story) => (
            <Card key={story.story_id} className='shadow-sm'>
              <CardContent className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <span className='text-sm text-gray-500'>
                    {formatTimeAgo(story.created_at)}
                  </span>
                </div>
                <p className='whitespace-pre-wrap'>{story.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
