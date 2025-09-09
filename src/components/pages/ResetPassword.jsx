import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { signUpSchema } from '../../schema/AuthFormsSchema';

const schema = z
  .object({
    password: signUpSchema.shape.password,
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((val) => val.password === val.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

export default function ResetPassword() {
  const [status, setStatus] = useState('idle'); // idle | ready | updating
  const [tokenChecked, setTokenChecked] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema), mode: 'onChange' });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('ready');
      }
      setTokenChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async ({ password }) => {
    try {
      setStatus('updating');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setStatus('ready');
        setError('password', { message: error.message });
        return;
      }
      // show success state allow user to return to login manually
      await supabase.auth.signOut();
      setStatus('success');
    } catch (err) {
      setStatus('ready');
      setError('password', { message: err.message || 'Update failed' });
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
            Reset Password
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
            {!tokenChecked && (
              <div className='text-white text-center'>Verifying link...</div>
            )}
            {tokenChecked && status === 'idle' && (
              <div className='text-white text-center'>
                Invalid or expired reset link.
              </div>
            )}
            {tokenChecked && status === 'ready' && (
              <>
                <h1 className='text-3xl font-semibold text-white text-center mb-8 font-afacad'>
                  Set a new password
                </h1>

                <form
                  className='space-y-4'
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <div className='mb-5'>
                    <label
                      htmlFor='password'
                      className='text-black text-xl block mb-2 font-afacad font-medium'
                    >
                      New password
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
                        placeholder='Enter a new password'
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <p className='text-red-600 text-l mt-1 font-afacad'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor='confirm'
                      className='text-black text-xl block mb-2 font-afacad font-medium'
                    >
                      Confirm password
                    </label>
                    <input
                      id='confirm'
                      type='password'
                      className='bg-white text-gray-900 rounded-2xl h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                      style={{
                        border: '1px solid #6E6E6E',
                        boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                      }}
                      placeholder='Re-enter your new password'
                      {...register('confirm')}
                    />
                    {errors.confirm && (
                      <p className='text-red-600 text-l mt-1 font-afacad'>
                        {errors.confirm.message}
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting || status !== 'ready'}
                    className='w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-12 font-medium transition-colors duration-200 font-afacad text-lg'
                    style={{
                      border: '1px solid #6E6E6E',
                      boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {status === 'updating' ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              </>
            )}
            {tokenChecked && status === 'success' && (
              <div className='text-center'>
                <h1 className='text-3xl font-semibold text-center mb-4 font-afacad'>
                  Password updated
                </h1>
                <p className='mb-6 font-afacad text-lg'>
                  Your password has been changed successfully. You can now sign
                  in with your new password.
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
