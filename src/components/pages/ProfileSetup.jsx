import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSetup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <main>
        <form className='flex flex-col items-center justify-center gap-5'>
          <h2 className='text-4xl font-semibold'>Profile Setup</h2>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='firstName'>First Name</label>

            <input
              id='firstName'
              name='firstName'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='First Name'
              required={true}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='lastName'>Last Name</label>

            <input
              id='lastName'
              name='lastName'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='Last Name'
              required={true}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='userName'>Username</label>

            <input
              id='userName'
              name='userName'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='Username'
              required={true}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='avatarUrl'>Profile Picture</label>

            <input
              id='avatarUrl'
              name='avatarUrl'
              className='border-2 p-2 rounded-sm text-center'
              type='file'
              accept='/image/*'
              placeholder='Profile Picture'
              required={true}
              onChange={(e) => setUsername(e.target.value)}
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
