import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseWrite } from '../../hooks/useSupabaseWrite';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { Navigate } from 'react-router-dom';
import { profileSetupSchema } from '../../schema/ProfileSchemas';
import { FileImage, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useUsernameCheck } from '../../hooks/useCheckUsername';

export default function ProfileSetup() {
  const { uploadFile } = useSupabaseStorage('profile-images');
  const {
    insertData,
    loading: insertLoading,
    error: insertError,
  } = useSupabaseWrite('profiles');
  const { session, signOut } = useAuth();
  const [fileName, setFileName] = useState('No file chosen');
  const {
    status: usernameStatus,
    isChecking,
    checkUsername,
    clearStatus,
  } = useUsernameCheck();
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  console.log(isChecking);
  // Check if the user already has a profile
  const { data: existingProfile, error: readError } = useSupabaseRead(
    'profiles',
    {
      filter: { id: session?.user?.id },
      single: true,
    }
  );

  if (existingProfile) {
    return <Navigate to='/dashboard' />;
  }

  const form = useForm({
    resolver: zodResolver(profileSetupSchema),
    mode: 'onChange',
    defaultValues: {
      name_first: '',
      name_last: '',
      username: '',
      avatar_url: null,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'username') {
        const username = value.username.trim();

        if (profileSetupSchema.shape.username.safeParse(username).success) {
          checkUsername(username);
        } else {
          clearStatus(); // reset status if invalid
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, checkUsername, clearStatus]);

  useEffect(() => {
    if (usernameStatus === 'taken') {
      form.setError('username', {
        type: 'manual',
        message: 'Username is already taken',
      });
    } else if (usernameStatus === 'available') {
      form.clearErrors('username');
    }

    form.trigger('username');
  }, [usernameStatus, form]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      form.setValue('avatar_url', file, {
        shouldValidate: true,
        shouldTouch: true,
      });
      form.clearErrors('avatar_url');
    }
  };

  const onSubmit = async (data) => {
    setSubmitError('');

    try {
      // Double-check username availability before proceeding
      if (usernameStatus === 'taken') {
        setSubmitError(
          'Username is already taken. Please choose a different username.'
        );
        return;
      }

      // Upload the profile picture first
      const { data: uploadData, error: uploadError } = await uploadFile(
        `${session?.user?.id}`,
        data.avatar_url
      );

      if (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        setSubmitError('Failed to upload profile picture. Please try again.');
        return;
      }

      // Get the public URL for the uploaded image
      const avatarUrl = uploadData.publicUrl;

      // Create the profile with the uploaded image URL
      const newProfile = {
        id: session?.user?.id,
        name_first: data.name_first,
        name_last: data.name_last,
        username: data.username,
        avatar_url: avatarUrl,
      };

      const result = await insertData(newProfile);

      if (result.error) {
        console.error('Error creating profile:', result.error);

        // Check if it's a unique constraint violation for username
        if (
          result.error.code === '23505' &&
          result.error.message.includes('username')
        ) {
          setSubmitError(
            'Username is already taken. Please choose a different username.'
          );
        } else {
          setSubmitError('Failed to create profile. Please try again.');
        }
        return;
      }

      // Success!
      navigate('/dashboard');
    } catch (error) {
      console.error('Error in profile setup:', error);
      setSubmitError(
        'An error occurred during profile setup. Please try again.'
      );
    }
  };

  const getUsernameStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className='w-5 h-5 text-gray-500 animate-spin' />;
    }

    switch (usernameStatus) {
      case 'available':
        return <Check className='w-5 h-5 text-green-500' />;
      case 'taken':
        return <X className='w-5 h-5 text-red-500' />;
      default:
        return null;
    }
  };

  const isFormValid = form.formState.isValid && usernameStatus === 'available';

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

      <div className='flex h-full items-center justify-center'>
        <div className='w-full max-w-none' style={{ width: '500px' }}>
          <div
            className='bg-white/10 backdrop-blur-sm rounded-2xl p-8'
            style={{
              border: '1px solid #6E6E6E',
              boxShadow: '0 0 12px rgba(0, 0, 0, 0.6)',
            }}
          >
            <h1 className='text-3xl font-semibold text-white text-center mb-8 font-afacad'>
              Almost done!
            </h1>

            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
              {[
                {
                  key: 'name_first',
                  label: 'First Name',
                  type: 'text',
                  placeholder: 'Enter your first name',
                  required: true,
                },
                {
                  key: 'name_last',
                  label: 'Last Name',
                  type: 'text',
                  placeholder: 'Enter your last name',
                  required: true,
                },
                {
                  key: 'username',
                  label: 'Username',
                  type: 'text',
                  placeholder: 'Choose a username',
                  required: true,
                  special: 'username',
                },
                {
                  key: 'avatar_url',
                  label: 'Profile Picture',
                  type: 'file',
                  required: true,
                  special: 'file',
                },
              ].map(({ key, label, type, placeholder, required, special }) => (
                <div key={key} className='mb-5'>
                  <label
                    htmlFor={key}
                    className='text-black text-xl block mb-2 font-afacad font-medium'
                  >
                    {label}{' '}
                    {required && <span className='text-red-500'>*</span>}
                  </label>

                  {special === 'username' ? (
                    <div className='relative'>
                      <input
                        id={key}
                        {...form.register(key)}
                        type={type}
                        className='bg-white text-gray-900 rounded-2xl h-12 w-full px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        style={{
                          border: '1px solid #6E6E6E',
                          boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                        }}
                        placeholder={placeholder}
                      />
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                        {getUsernameStatusIcon()}
                      </div>
                    </div>
                  ) : special === 'file' ? (
                    <div className='flex items-center gap-3'>
                      <label
                        htmlFor={key}
                        className='bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-12 px-6 font-medium transition-colors duration-200 flex items-center cursor-pointer font-afacad text-lg'
                        style={{
                          border: '1px solid #6E6E6E',
                          boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        Choose File
                        <input
                          id={key}
                          type={type}
                          accept='image/*'
                          className='hidden'
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className='text-black font-afacad text-lg'>
                        {fileName}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <input
                        id={key}
                        {...form.register(key)}
                        type={type}
                        className='bg-white text-gray-900 rounded-2xl h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        style={{
                          border: '1px solid #6E6E6E',
                          boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                        }}
                        placeholder={placeholder}
                      />
                    </div>
                  )}

                  {form.formState.errors[key] && (
                    <p className='text-red-600 text-l mt-1 font-afacad'>
                      {form.formState.errors[key].message}
                    </p>
                  )}
                  {key === 'username' && usernameStatus === 'available' && (
                    <p className='text-green-600 text-l mt-1 font-afacad'>
                      Username is available!
                    </p>
                  )}
                </div>
              ))}
              {/* Error Messages */}
              {(insertError || submitError) && (
                <div className='text-red-300 text-lg text-center mb-4 font-afacad'>
                  {submitError ||
                    insertError?.message ||
                    'An error occurred, please try again'}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={insertLoading || !isFormValid}
                className='w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-12 font-medium transition-colors duration-200 font-afacad text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                style={{
                  border: '1px solid #6E6E6E',
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
                }}
              >
                {insertLoading ? 'Creating Profile...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
