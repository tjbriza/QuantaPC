import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseWrite } from '../../hooks/useSupabaseWrite';

export default function ProfileSetup() {
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProfile = {
      id: formdata.id,
      name_first: formdata.name_first,
      name_last: formdata.name_last,
      username: formdata.username,
      avatar_url: formdata.avatar_url,
    };

    const result = await insertData(newProfile);

    if (result.error) {
      console.error('Error creating profile:', error);
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
          {error && <p>An error occured, please try again: {error}</p>}
        </form>
      </main>
    </>
  );
}
