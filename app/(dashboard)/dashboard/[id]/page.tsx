// pages/dashboard/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import DeleteButton from '../../components/deleteButton';
import Link from 'next/link';

const supabase = createClient();

const EntryDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const entryId = Array.isArray(id) ? id[0] : id;  // Ensure `entryId` is a string
  const [entry, setEntry] = useState<{ title: string; text: string; created_at: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entryId) {
      setError("Invalid entry ID");
      return;
    }

    const fetchEntry = async () => {
      try {
        const { data: entryData, error: entryError } = await supabase
          .from('journal')
          .select('title, text, created_at')
          .eq('id', entryId)
          .single();

        if (entryError) {
          throw new Error(entryError.message);
        }

        setEntry(entryData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{entry?.title}</h1>
      <p>{entry?.text}</p>
      <h5>Created At: {entry?.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}</h5>
      <Link href={`/dashboard/update/${entryId}`}>
              <button>Edit</button></Link>
      {entryId && (
        <DeleteButton
          entryId={entryId}
          onDelete={() => {
            alert('Entry deleted successfully!');
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default EntryDetailPage;
