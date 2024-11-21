'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Filter } from 'bad-words';

const supabase = createClient();
const filter = new Filter();

interface UserStory {
  story_id: number;
  text: string;
  created_at: string;
}

const NewStoryPage = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingStory, setExistingStory] = useState<UserStory | null>(null);

  useEffect(() => {
    const fetchExistingStory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('user_story')
        .select('*')
        .eq('author_id', user.id)
        .gte(
          'created_at',
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        )
        .single();

      if (data) {
        setExistingStory(data);
        setText(data.text);
      }
    };

    fetchExistingStory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: userError } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        throw new Error('Please log in to share your story.');
      }

      const cleanText = filter.clean(text);

      if (existingStory) {
        // Update existing story with filtered text
        const { error: updateError } = await supabase
          .from('user_story')
          .update({ text: cleanText })
          .eq('story_id', existingStory.story_id);

        if (updateError) throw new Error(updateError.message);
      } else {
        // Insert new story with filtered text
        const { error: insertError } = await supabase
          .from('user_story')
          .insert([{ text: cleanText, author_id: user.id }]);

        if (insertError) throw new Error(insertError.message);
      }

      router.push('/story');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingStory) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_story')
        .delete()
        .eq('story_id', existingStory.story_id);

      if (deleteError) throw new Error(deleteError.message);

      router.push('/story');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='p-6'>
      <Card className='shadow-md p-6'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>
            {existingStory ? 'Edit Your Story' : 'Share Your Story'}
          </CardTitle>
          <p className='text-sm text-gray-500'>
            Your story will be visible for the next 24 hours
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Your Story
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                rows={6}
                required
                placeholder='Share your story here...'
              />
            </label>
            {error && <div className='text-red-600 text-sm'>{error}</div>}
            <div className='flex gap-2'>
              <Button type='submit' variant='default' disabled={loading}>
                {loading
                  ? 'Saving...'
                  : existingStory
                  ? 'Update Story'
                  : 'Share Story'}
              </Button>

              {existingStory && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive'>Delete Story</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your story.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStoryPage;
