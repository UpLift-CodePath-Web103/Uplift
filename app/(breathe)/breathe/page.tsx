'use client';

import React, { useState } from 'react';
import { Video } from '../../(journal)/components/Video';
import { Button } from '@/components/ui/button';

function Page() {
  const [embed, setEmbed] = useState('eZBa63NZbbE');
  const embeds = ['eZBa63NZbbE', 'TXNECaIJPDI', 'LiUnFJ8P4gM'];

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Breathing Exercise</h1>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => setEmbed(embeds[0])}>
          1 Minute
        </Button>
        <Button variant="outline" onClick={() => setEmbed(embeds[1])}>
          5 Minutes
        </Button>
        <Button variant="outline" onClick={() => setEmbed(embeds[2])}>
          10 Minutes
        </Button>
      </div>

      <div className="w-full max-w-2xl aspect-w-16 aspect-h-9">
        <Video src={`https://www.youtube.com/embed/${embed}`} />
      </div>
    </div>
  );
}

export default Page;
