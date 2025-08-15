import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AtSign, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInUser, signInWithGoogle } = useAuth();

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
    <div className='relative h-screen overflow-hidden'>
      {/* Logo in top left */}
      <Link
        to='/'
        className='absolute top-8 left-32 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105'
      >
        <img
          src='/images/logo.png'
          alt='Quanta PC'
          className='h-12 w-auto transition-all duration-300'
        />
      </Link>

      <div className='flex-1 flex flex-col items-center justify-center p-6 pt-24'>
        {/* Tab Navigation - Outside the card */}
        <div className='flex justify-center space-x-8 mb-6'>
          <span className='text-white text-xl font-medium border-b-2 border-transparent pb-1 relative font-afacad'>
            Login
            <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full'></span>
          </span>
          <Link
            to='/signup'
            className='text-white/70 text-xl font-medium hover:text-white transition-colors duration-200 relative group font-afacad'
          >
            Sign Up
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full'></span>
          </Link>
        </div>

        <div className='w-full max-w-none' style={{ width: '500px' }}>
          <div
            className='bg-white/10 backdrop-blur-sm rounded-2xl p-8'
            style={{
              border: '1px solid #6E6E6E',
              boxShadow: '0 0 12px rgba(0, 0, 0, 0.6)',
            }}
          >
            <h1 className='text-3xl font-semibold text-white text-center mb-8 font-afacad'>
              Welcome Back!
            </h1>

            <form className='space-y-4' onSubmit={handleLogin}>
              <div className='mb-5'>
                <label
                  htmlFor='email'
                  className='text-black text-xl block mb-2 font-afacad font-medium'
                >
                  Email
                </label>
                <div className='relative'>
                  <AtSign className='absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5' />
                  <input
                    id='email'
                    type='email'
                    className='pl-10 bg-white text-gray-900 rounded-2xl h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    style={{
                      border: '1px solid #6E6E6E',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                    }}
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div className='mb-5'>
                <label
                  htmlFor='password'
                  className='text-black text-xl block mb-2 font-afacad font-medium'
                >
                  Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5' />
                  <input
                    id='password'
                    type='password'
                    className='pl-10 bg-white text-gray-900 rounded-2xl h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    style={{
                      border: '1px solid #6E6E6E',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                    }}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div className='text-left mb-6'>
                <Link
                  to='#'
                  className='text-black text-xl hover:text-black/80 font-afacad font-medium'
                >
                  Forgot Your Password?
                </Link>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-12 font-medium transition-colors duration-200 font-afacad text-lg'
                style={{
                  border: '1px solid #6E6E6E',
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {error && (
                <p className='text-red-300 text-lg text-center font-afacad'>
                  Error: {error}
                </p>
              )}

              <div className='text-center'>
                <span className='text-black/80 text-xl font-afacad'>Or</span>
              </div>

              <a
                onClick={signInWithGoogle}
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-pointer w-full bg-white/90 text-gray-900 border border-white/30 hover:bg-white rounded-2xl h-12 font-medium transition-colors duration-200 flex items-center justify-center font-afacad text-lg'
                style={{
                  border: '1px solid #6E6E6E',
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                }}
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Log in with Google
              </a>
            </form>

            <div className='mt-8 text-center'>
              <span className='text-black/80 text-lg font-afacad'>
                Don't have an account?{' '}
                <Link
                  to='/signup'
                  className='text-black font-bold hover:underline font-afacad text-lg'
                >
                  Sign up!
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
