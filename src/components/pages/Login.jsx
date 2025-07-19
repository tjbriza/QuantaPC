import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <main>
        <form
          className='flex flex-col items-center justify-center gap-5'
          action=''
        >
          <h2 className='text-4xl font-semibold'>
            Log in to your QuantaPC account
          </h2>
          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              name='email'
              className='border-2 p-2 rounded-sm'
              type='text'
              placeholder='Email'
            />
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              className='border-2 p-2 rounded-sm'
              type='password'
              placeholder='Password'
            />
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
