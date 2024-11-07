import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export default function NewEntryPage() {

  async function handleSubmit(formData: FormData) {
    'use server';

    const title = formData.get('title')?.toString() || '';
    const text = formData.get('text')?.toString() || '';

    const { data, error: userError } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      throw new Error('Please log in to create an entry.');
    }
    console.log(user)
    const { error } = await supabase
      .from('journal')
      .insert([{ title, text, user_id: user.id }]); // Ensure the user_id is set correctly

    if (error) {
      console.log(error)
    }
    else{
      console.log('success')
    }

    
  }

  return (
    <div>
      <h1>Create a New Entry</h1>
      <form action={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" required />
        </label>
        <br />
        <label>
          Text:
          <textarea name="text" required></textarea>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
