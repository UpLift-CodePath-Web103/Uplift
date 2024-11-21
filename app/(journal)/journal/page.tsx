// Page component
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import DeleteButton from '../components/deleteButton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const supabase = createClient();

const Page: React.FC = () => {
  const [entries, setEntries] = useState<{ id: string; title: string; text: string; created_at: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak,setStreak] = useState()
  let day = 'day'
  
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error: userError } = await supabase.auth.getUser();
      const user = data?.user;
      userError
      if (!user) {
        throw new Error('Please log in to create an entry.');
      }

      const { data: entriesData, error: entriesError } = await supabase
        .from('journal')
        .select('id, title, text, created_at')
        .eq('user_id', user.id);

      if (entriesError) {
        throw new Error(entriesError.message);
      }

      const { data: streakData, error: streakError } = await supabase
        .from('user_streak')
        .select('streak_length')
        .eq('user_id', user.id)
        .single();
      
      if (streakError && streakError.details !== 'Results contain no data') {
        throw new Error(`Failed to fetch streak: ${streakError.message}`);
      }

      setEntries(entriesData || []);
      setStreak(streakData?.streak_length)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("error")
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
     <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Entries</h1>
        <span className="text-2xl font-bold">
          <span role="img" aria-label="fire">🔥</span>{streak} {streak == 1?day = "day":day="days"}
        </span>
      </div>
      {entries.length === 0 ? (
        <h2>No entries made yet</h2>
      ) : (
        entries.map((entry) => (
          <Card key={entry.id} className="mb-4 shadow-md">
            <CardHeader>
              <CardTitle>
                <Link href={`/journal/${entry.id}`} className="text-lg font-semibold hover:underline">
                  {entry.title}
                </Link>
              </CardTitle>
              <CardDescription>
                Created At: {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{entry.text}</p>
              <div className="mt-4 flex space-x-4">
                <Link href={`/journal/update/${entry.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <DeleteButton entryId={entry.id} onDelete={fetchEntries} /> {/* Pass fetchEntries as onDelete */}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Page;
