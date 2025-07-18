import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        navigate('/profilesetup');
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
          onSubmit={handleSignUp}
        >
          <h2 className='text-4xl font-semibold'>
            Create an QuantaPC account!
          </h2>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='email'>Email</label>

            <input
              id='email'
              name='email'
              className='border-2 p-2 rounded-sm text-center'
              type='text'
              placeholder='Email'
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='password'>Password</label>

            <input
              id='password'
              name='password'
              className='border-2 p-2 rounded-sm text-center'
              type='password'
              placeholder='Password'
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>
            <label htmlFor='confirmPassword'>Confirm Password</label>

            <input
              id='confirmPassword'
              name='confirmPassword'
              className='border-2 p-2 rounded-sm text-center'
              type='password'
              placeholder='Confirm Password'
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
        <p className='text-center mt-4'>
          Already have an account?{' '}
          <Link className='hover:underline font-semibold' to='/login'>
            Log in!{' '}
          </Link>
        </p>
      </main>
    </>
  );
}
