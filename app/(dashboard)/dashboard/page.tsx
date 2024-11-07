// app/(dashboard)/page.tsx

import React from 'react';
import Journal from './journal/Journal';
import { createClient } from '@/utils/supabase/server';

type Entry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

async function fetchEntries() {
  const supabase = createClient();

  // Check for an authenticated user
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session?.user) {
    // You can handle redirection here if needed, or return an empty array
    return [];
  }

  const userId = session.user.id;

  // Fetch journal entries for the logged-in user
  const { data: entries, error } = await supabase
    .from('Entries')
    .select('id, title, content, created_at')
    .eq('user_id', userId);

  if (error) {
    console.error(error);
    return [];
  }

  return entries ?? [];
}

export default async function Page() {
  const entries = await fetchEntries();

  return (
    <div>
      <h1>THIS IS YOUR MOOD</h1>
      <Journal entries={entries} />
    </div>
  );
}
