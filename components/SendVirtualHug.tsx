'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const supabase = createClient();

export default function SendVirtualHug({ receiverId }: { receiverId: string }) {
  const [isSending, setIsSending] = useState(false);

  const sendHug = async () => {
    setIsSending(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please login to send virtual hugs');
        return;
      }

      const { error } = await supabase.from('virtual_hugs').insert({
        sender_id: user.id,
        receiver_id: receiverId,
      });

      if (error) throw error;

      toast.success('Virtual hug sent! 🤗');
    } catch (error) {
      toast.error('Failed to send virtual hug');
      console.error('Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='flex gap-2 mt-4'>
      <button
        onClick={sendHug}
        disabled={isSending}
        className={`flex items-center gap-1 px-3 py-1 rounded-full 
        ${
          isSending
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-gray-100 hover:bg-gray-200'
        } transition-colors`}
      >
        <span>🤗</span>
        <span className='text-sm text-gray-600'>
          {isSending ? 'Sending...' : 'Send Hug'}
        </span>
      </button>
    </div>
  );
}
