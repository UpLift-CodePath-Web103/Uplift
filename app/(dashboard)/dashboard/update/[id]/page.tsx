// pages/dashboard/update/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const UpdateEntryPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<{ title: string; text: string } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data: entryData, error: entryError } = await supabase
          .from('journal')
          .select('title, text')
          .eq('id', id)
          .single();

        if (entryError) {
          throw new Error(entryError.message);
        }

        setEntry(entryData);
        setNewTitle(entryData.title);
        setNewText(entryData.text);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const { error: updateError } = await supabase
        .from('journal')
        .update({ title: newTitle, text: newText })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      router.push(`/dashboard/${id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Update Entry</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <label>
          Title:
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </label>
        <label>
          Text:
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </label>
        <button type="submit">Update Entry</button>
      </form>
    </div>
  );
};

export default UpdateEntryPage;
