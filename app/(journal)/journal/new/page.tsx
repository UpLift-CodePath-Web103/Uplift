'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const supabase = createClient();

const NewEntryPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not logged in. Please log in and try again.');
      }
      const userId = userData.user.id;

      const { error: insertError } = await supabase
        .from('journal')
        .insert([{ title: title, text: text, user_id: userId }]);
      if (insertError) {
        throw new Error(`Failed to create entry: ${insertError.message}`);
      }

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      const { data: streakData, error: streakError } = await supabase
        .from('user_streak')
        .select('start_date, end_date, streak_length')
        .eq('user_id', userId)
        .single();
      
      if (streakError && streakError.details !== 'Results contain no data') {
        throw new Error(`Failed to fetch streak: ${streakError.message}`);
      }
      if (streakData) {
        if (streakData.end_date === yesterday) {
          await supabase
            .from('user_streak')
            .update({
              end_date: today,
              streak_length: streakData.streak_length + 1,
            })
            .eq('user_id', userId);
        } else if (streakData.end_date !== today) {
          await supabase
            .from('user_streak')
            .update({
              start_date: today,
              end_date: today,
              streak_length: 1,
            })
            .eq('user_id', userId);
        }
      } else {
        await supabase
          .from('user_streak')
          .insert({
            start_date: today,
            end_date: today,
            streak_length: 1,
          });
      }

      router.push('/journal');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Create a New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Text
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows={4}
                required
              />
            </label>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewEntryPage;
