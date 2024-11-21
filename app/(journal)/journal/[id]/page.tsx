// pages/dashboard/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import DeleteButton from '../../components/deleteButton';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const supabase = createClient();

const EntryDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const entryId = Array.isArray(id) ? id[0] : id;
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

    fetchEntry();
  }, [entryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <Card className="shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{entry?.title}</CardTitle>
          <CardDescription>
            Created At: {entry?.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{entry?.text}</p>
          <div className="flex space-x-4">
            <Link href={`/journal/update/${entryId}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            {entryId && (
              <DeleteButton
                entryId={entryId}
                onDelete={() => {
                  alert('Entry deleted successfully!');
                  router.push('/journal');
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryDetailPage;
