import { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (!token_hash || !type) {
    redirect('/error');
  }

  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    redirect('/error');
  }

  // If successful, redirect to the next page
  redirect(next);
}
