import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseWrite } from '../../hooks/useSupabaseWrite';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { Navigate } from 'react-router-dom';

export default function ProfileSetup() {
  const { uploadFile } = useSupabaseStorage('profile-images');
  const { insertData, loading, error } = useSupabaseWrite('profiles');
  const { session, signOut } = useAuth();
  const [formdata, setFormData] = useState({
    id: session?.user?.id || '',
    name_first: '',
    name_last: '',
    username: '',
    avatar_url: '',
  });

  const navigate = useNavigate();

  // Check if the user already has a profile
  const { data: existingProfile, error: readError } = useSupabaseRead(
    'profiles',
    {
      filter: { id: session?.user?.id },
      single: true,
    }
  );
  if (existingProfile) {
    // If a profile already exists, redirect to the dashboard
    return <Navigate to='/dashboard' />;
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.avatar_url) {
      alert('Please upload a profile picture.');
      return;
    }
    // Upload the avatar image to Supabase Storage
    const { data: uploadData, error: uploadError } = await uploadFile(
      `${formdata.id}`,
      formdata.avatar_url
    );

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      alert('Failed to upload profile picture. Please try again.');
      return;
    }
    // Get the public URL of the uploaded image
    const avatarUrl = uploadData.publicUrl;

    const newProfile = {
      id: formdata.id,
      name_first: formdata.name_first,
      name_last: formdata.name_last,
      username: formdata.username,
      avatar_url: avatarUrl,
    };

    const result = await insertData(newProfile);

    if (result.error) {
      console.error('Error creating profile:', result.error);
    } else {
      alert('Profile created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <>
      <main>
        <form
          className='flex flex-col items-center justify-center gap-5'
          onSubmit={handleSubmit}
        >
          <h2 className='text-4xl font-semibold'>Profile Setup</h2>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='name_first'>First Name</label>

            <input
              id='name_first'
              name='name_first'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='First Name'
              required={true}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='name_last'>Last Name</label>

            <input
              id='name_last'
              name='name_last'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='Last Name'
              required={true}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='username'>username</label>

            <input
              id='username'
              name='username'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='username'
              required={true}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='avatar_url'>Profile Picture</label>

            <input
              id='avatar_url'
              name='avatar_url'
              className='border-2 p-2 rounded-sm text-center'
              type='file'
              accept='image/*'
              placeholder='Profile Picture'
              required={true}
              onChange={handleChange}
            />
          </div>

          <button
            className='border-2 px-8 py-2 rounded-sm hover:bg-gray-300 hover:underline transition-colors duration-200'
            type='submit'
            disabled={loading}
          >
            Submit
          </button>
          {error && <p>An error occured. Please try again: {error}</p>}
        </form>
      </main>
    </>
  );
}
