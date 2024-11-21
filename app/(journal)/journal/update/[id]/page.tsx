// pages/dashboard/update/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const supabase = createClient();

const UpdateEntryPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<{ title: string; text: string } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  entry

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
  }, [id]);

  const handleUpdate = async () => {
    try {
      const { error: updateError } = await supabase
        .from('journal')
        .update({ title: newTitle, text: newText,updated_at:new Date().toISOString().slice(0, 10) })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      router.push(`/journal/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("error")
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <Card className="shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Update Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-gray-700">
              Title
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Text
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows={4}
                required
              />
            </label>
            <Button type="submit" variant="default">
              Update Entry
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateEntryPage;
