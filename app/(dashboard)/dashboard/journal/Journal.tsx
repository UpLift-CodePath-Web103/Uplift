// app/(dashboard)/journal/Journal.tsx

import React from 'react';

type Entry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type Props = {
  entries: Entry[];
};

export default function Journal({ entries }: Props) {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Journal Entries</h1>

      {entries.length > 0 ? (
        entries.map((entry) => (
          <div key={entry.id} className="mb-6 p-4 border rounded shadow-sm bg-white">
            <h2 className="text-lg font-bold">{entry.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(entry.created_at).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">{entry.content}</p>
          </div>
        ))
      ) : (
        <p>No entries found for your journal.</p>
      )}
    </div>
  );
}
