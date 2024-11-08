// pages/dashboard/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import DeleteButton from '../components/deleteButton';

const supabase = createClient();

const Page: React.FC = () => {
  const [entries, setEntries] = useState<{ id: string; title: string; text: string; created_at: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const { data: entriesData, error: entriesError } = await supabase
          .from('journal')
          .select('id, title, text, created_at');

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

    fetchEntries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your entries</h1>
      {entries.length === 0 ? (
        <h2>No entries made yet</h2>
      ) : (
        entries.map((entry) => (
          <div key={entry.id}>
            <h4>
              Title: <Link href={`/dashboard/${entry.id}`}>{entry.title}</Link>
            </h4>
            <p>Text: {entry.text}</p>
            <h5>
              Created At: {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}
            </h5>
            <Link href={`/dashboard/update/${entry.id}`}>
              <button>Edit</button>
            </Link>
            <DeleteButton entryId={entry.id} />
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
