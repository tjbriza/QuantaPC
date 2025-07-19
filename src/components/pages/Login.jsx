import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInUser } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      setError(
        'An unexpected error occurred. Please try again: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main>
        <form
          className='flex flex-col items-center justify-center gap-5'
          onSubmit={handleLogin}
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
              onChange={(e) => setEmail(e.target.value)}
              required={true}
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
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </div>

          <button
            className='border-2 px-8 py-2 rounded-sm hover:bg-gray-300 hover:underline transition-colors duration-200'
            type='submit'
            disabled={loading}
          >
            Submit
          </button>
          {error && <p>error has occured: {error}</p>}
        </form>
        <p className='text-center mt-4'>
          Don't have an account yet?{' '}
          <Link className='hover:underline font-semibold' to='/signup'>
            Sign up!{' '}
          </Link>
        </p>
      </main>
    </>
  );
}
