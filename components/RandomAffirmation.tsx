'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function RandomAffirmation() {
  const [affirmation, setAffirmation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchAffirmation = async () => {
    try {
      const response = await fetch('/api/affirmation');
      const data = await response.json();
      setAffirmation(data.affirmation);
    } catch (error) {
      console.error('Error fetching affirmation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffirmation();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Daily Affirmation</h2>
      <div className='p-4 rounded-lg border bg-blue-50 border-blue-200'>
        <p className='text-lg font-medium text-center'>{affirmation}</p>
        <Button
          onClick={fetchAffirmation}
          variant='outline'
          className='mt-4 mx-auto flex items-center gap-2 rounded-full'
        >
          ✨ New Affirmation
        </Button>
      </div>
    </div>
  );
}
