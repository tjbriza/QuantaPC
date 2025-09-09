import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext.jsx';
import { AtSign } from 'lucide-react';
import { adminLogin } from '../../schema/AuthSchema';

const schema = adminLogin.pick({ email: true });

export default function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({ resolver: zodResolver(schema), mode: 'onChange' });

  const onSubmit = async ({ email }) => {
    clearErrors('root');
    const { success, error } = await resetPasswordForEmail(email.trim());
    if (success) {
      setSubmitted(true);
    } else {
      setError('root', {
        message: error?.message || 'Failed to send reset email.',
      });
    }
  };

  return (
    <div className='relative h-screen overflow-hidden'>
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
        <div className='flex justify-center space-x-8 mb-6'>
          <span className='text-white text-xl font-medium border-b-2 border-transparent pb-1 relative font-afacad'>
            Forgot Password
            <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full'></span>
          </span>
          <Link
            to='/login'
            className='text-white/70 text-xl font-medium hover:text-white transition-colors duration-200 relative group font-afacad'
          >
            Back to Login
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
            {!submitted ? (
              <>
                <h1 className='text-3xl font-semibold text-white text-center mb-8 font-afacad'>
                  Reset your password
                </h1>
                <form
                  className='space-y-4'
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
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
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className='text-red-600 text-l mt-1 font-afacad'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-12 font-medium transition-colors duration-200 font-afacad text-lg'
                    style={{
                      border: '1px solid #6E6E6E',
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send reset link'}
                  </button>

                  {errors.root && (
                    <p className='text-red-300 text-lg text-center font-afacad'>
                      Error: {errors.root.message}
                    </p>
                  )}
                </form>
              </>
            ) : (
              <div className='text-center'>
                <h1 className='text-3xl font-semibold  text-center mb-4 font-afacad'>
                  Check your email
                </h1>
                <p className=' mb-6 font-afacad text-lg'>
                  If an account exists for that email, a password reset link has
                  been sent.
                </p>
                <Link
                  to='/login'
                  className='inline-block w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-12 leading-[3rem] font-medium transition-colors duration-200 font-afacad text-lg'
                  style={{
                    border: '1px solid #6E6E6E',
                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Return to sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
