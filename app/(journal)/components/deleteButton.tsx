// components/DeleteButton.tsx
import React from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface DeleteButtonProps {
  entryId: string;
  onDelete?: () => void; // Optional callback for after deletion, if needed
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ entryId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('journal')
        .delete()
        .eq('id', entryId);

      if (error) {
        throw new Error(error.message);
      }

      if (onDelete) {
        onDelete(); // Trigger callback if provided
      } else {
        // Optionally, you could add some notification or redirection after deletion
        alert('Entry deleted successfully!');
      }
    } catch (err: any) {
      console.error('Failed to delete entry:', err.message);
    }
  };

  return (
    <button onClick={handleDelete} style={{ color: 'red' }}>
      Delete
    </button>
  );
};

export default DeleteButton;
