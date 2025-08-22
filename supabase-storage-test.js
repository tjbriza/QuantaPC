// test-storage.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Replace with your Supabase project URL and anon key (service_role key if you want to bypass RLS)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Replace with test account credentials
  const email = 'testgmail';
  const password = 'testpass';

  // Sign in
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }
  console.log('Signed in as:', authData.user.email);

  // File to upload
  const filePath = './test.png'; // put a small test file here
  const fileBuffer = fs.readFileSync(filePath);

  // Name file with UID (policy requires name === uid)
  const userId = authData.user.id;
  const fileName = userId; // must match auth.uid()::text

  // Upload
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
  } else {
    console.log('Upload success:', uploadData);
  }

  // List
  const { data: listData, error: listError } = await supabase.storage
    .from('profile-images')
    .list();
  if (listError) {
    console.error('List error:', listError.message);
  } else {
    console.log('List result:', listData);
  }

  // Delete
  const { error: deleteError } = await supabase.storage
    .from('profile-images')
    .remove([fileName]);
  if (deleteError) {
    console.error('Delete error:', deleteError.message);
  } else {
    console.log('Delete success for:', fileName);
  }
}

main();
