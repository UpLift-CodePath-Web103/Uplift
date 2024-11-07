'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

const Page: React.FC = () => {
  const [entries, setEntries] = useState<{ title: string; text: string; created_at: string }[]>([]);
  const [user, setUser] = useState<User | null>(null);  // Allow both User and null
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndEntries = async () => {
      try {
        setLoading(true);

        // Get the logged-in user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError('Please log in to view your entries.');
          return;
        }

        setUser(userData.user);

        // Fetch entries for the logged-in user
        const { data: entriesData, error: entriesError } = await supabase
          .from('journal')
          .select('title, text, created_at')
          .eq('user_id', userData.user.id);

        if (entriesError) {
          throw new Error(entriesError.message);
        }

        setEntries(entriesData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEntries();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your entries</h1>
      {entries.length === 0 ? (
        <h2>No entries made yet</h2>
      ) : (
        entries.map((entry, index) => (
          <div key={index}>
            <h3>User ID: {user?.id}</h3>
            <h4>Title: {entry.title}</h4>
            <p>Text: {entry.text}</p>
            <h5>Created At: {new Date(entry.created_at).toLocaleDateString()}</h5>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
