import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInUser } = UserAuth();

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

          <button type='submit' disabled={loading}>
            Submit
          </button>
          {error && <p>error has occured: {error}</p>}
        </form>
      </main>
    </>
  );
}
