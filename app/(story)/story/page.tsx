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

interface ReactionStats {
  [key: string]: {
    reaction: string;
    count: number;
    has_reacted: boolean;
  };
}

const AVAILABLE_REACTIONS = ['❤️', '🌟', '🎉', '✨', '🙏', '👏', '💪'];

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

  const StoryReactions = ({ storyId }: { storyId: number }) => {
    const [reactionStats, setReactionStats] = useState<ReactionStats>({});
    const [isLoading, setIsLoading] = useState(false);
    const [userCurrentReaction, setUserCurrentReaction] = useState<
      string | null
    >(null);

    const fetchReactions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get reaction counts
      const { data: reactions } = await supabase.rpc('get_reaction_counts', {
        story_id_param: storyId,
      });

      // Get user's current reaction
      const { data: userReaction } = await supabase
        .from('story_reactions')
        .select('reaction')
        .eq('story_id', storyId)
        .eq('user_id', user?.id)
        .single();

      // Transform into stats object
      const stats: ReactionStats = {};
      AVAILABLE_REACTIONS.forEach((reaction) => {
        const reactionCount =
          reactions?.find((r: { reaction: string }) => r.reaction === reaction)
            ?.count || 0;
        const hasReacted = userReaction?.reaction === reaction;

        stats[reaction] = {
          reaction,
          count: reactionCount,
          has_reacted: hasReacted,
        };
      });

      setReactionStats(stats);
      setUserCurrentReaction(userReaction?.reaction || null);
    };

    const handleReaction = async (reaction: string) => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        if (userCurrentReaction === reaction) {
          // Remove reaction if clicking the same one
          await supabase.from('story_reactions').delete().match({
            story_id: storyId,
            user_id: user.id,
          });
        } else {
          // Upsert reaction (insert or update)
          await supabase.from('story_reactions').upsert(
            {
              story_id: storyId,
              user_id: user.id,
              reaction: reaction,
            },
            {
              onConflict: 'story_id,user_id',
            }
          );
        }

        await fetchReactions();
      } catch (error) {
        console.error('Error updating reaction:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchReactions();
    }, [storyId]);

    return (
      <div className='flex gap-2 mt-4'>
        {AVAILABLE_REACTIONS.map((reaction) => (
          <button
            key={reaction}
            onClick={() => handleReaction(reaction)}
            disabled={isLoading}
            className={`flex items-center gap-1 px-3 py-1 rounded-full 
              ${
                reactionStats[reaction]?.has_reacted
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
          >
            <span>{reaction}</span>
            <span className='text-sm text-gray-600'>
              {reactionStats[reaction]?.count || 0}
            </span>
          </button>
        ))}
      </div>
    );
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
                <StoryReactions storyId={story.story_id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
