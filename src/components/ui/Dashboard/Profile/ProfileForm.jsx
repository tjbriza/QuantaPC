import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../../../schema/ProfileSchemas';
import { Brush, User, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useUsernameCheck } from '../../../../hooks/useCheckUsername';
export default function ProfileForm({
  localProfile,
  onSubmit,
  isLoading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { session } = useAuth();

  const {
    status: usernameStatus,
    isChecking,
    checkUsername,
    clearStatus,
  } = useUsernameCheck(session?.user?.id);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: localProfile || {},
    values: localProfile,
  });

  useEffect(() => {
    if (!isEditing) {
      clearStatus();
      return;
    }

    const subscription = form.watch((value, { name }) => {
      if (name === 'username') {
        checkUsername(value.username, localProfile?.username);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isEditing, localProfile?.username, checkUsername, clearStatus]);

  useEffect(() => {
    if (usernameStatus === 'taken') {
      form.setError('username', {
        type: 'manual',
        message: 'Username is already taken',
      });
    } else if (usernameStatus === 'available') {
      form.clearErrors('username');
    }
  }, [usernameStatus, form]);

  const handleSave = async (formData) => {
    if (
      formData.username !== localProfile?.username &&
      usernameStatus === 'taken'
    ) {
      return; // Form validation will show the error
    }

    await onSubmit(formData);
    setIsEditing(false);
    clearStatus();
  };

  const handleCancel = () => {
    form.reset(localProfile);
    setIsEditing(false);
  };

  const getUsernameStatusIcon = () => {
    if (!isEditing) return null;

    switch (usernameStatus) {
      case 'checking':
        return <Loader2 className='w-4 h-4 text-gray-500 animate-spin' />;
      case 'available':
        return <Check className='w-4 h-4 text-green-500' />;
      case 'taken':
        return <X className='w-4 h-4 text-red-500' />;
      default:
        return isChecking ? (
          <Loader2 className='w-4 h-4 text-gray-500 animate-spin' />
        ) : null;
    }
  };

  // Form validation
  const isFormValid =
    form.formState.isValid &&
    !isChecking &&
    (usernameStatus === '' || usernameStatus === 'available') &&
    usernameStatus !== 'taken';

  return (
    <div className='w-full'>
      <div className='flex gap-4 items-end-safe mb-2 pb-4'>
        <h2 className='text-3xl font-bold'>Profile</h2>
        {!isEditing ? (
          <button
            className='px-4 text-black text-xl rounded flex gap-2 hover:underline'
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
            <Brush className='w-6 h-6' />
          </button>
        ) : (
          <div className='flex gap-2'>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50'
              onClick={form.handleSubmit(handleSave)}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              className='px-4 py-2 bg-gray-300 rounded'
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-row gap-2 min-w-[200px]'>
        {/* First Name and Last Name fields */}
        {[
          { key: 'name_first', label: 'First Name:' },
          { key: 'name_last', label: 'Last Name:' },
        ].map(({ key, label }) => (
          <div key={key} className='flex flex-col gap-2'>
            <p className='text-lg font-bold pr-20'>{label}</p>
            {isEditing ? (
              <div>
                <input
                  {...form.register(key)}
                  className={`border p-1 rounded ${
                    form.formState.errors[key]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {form.formState.errors[key] && (
                  <p className='text-red-500 text-sm mt-1'>
                    {form.formState.errors[key].message}
                  </p>
                )}
              </div>
            ) : (
              <p className='p-1'>{localProfile?.[key] || '-'}</p>
            )}
          </div>
        ))}

        {/* Username field with special handling */}
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-bold pr-20'>Username:</p>
          {isEditing ? (
            <div>
              <div className='relative'>
                <input
                  {...form.register('username')}
                  className={`border p-1 rounded pr-8 ${
                    form.formState.errors.username
                      ? 'border-red-500'
                      : usernameStatus === 'available'
                      ? 'border-green-500'
                      : 'border-gray-300'
                  }`}
                />
                <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                  {getUsernameStatusIcon()}
                </div>
              </div>

              {/* Username validation messages */}
              {form.formState.errors.username && (
                <p className='text-red-500 text-sm mt-1'>
                  {form.formState.errors.username.message}
                </p>
              )}
              {usernameStatus === 'available' && (
                <p className='text-green-600 text-sm mt-1'>
                  Username is available!
                </p>
              )}
              {isChecking && (
                <p className='text-gray-500 text-sm mt-1'>
                  Checking availability...
                </p>
              )}
            </div>
          ) : (
            <p className='p-1'>{localProfile?.username || '-'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
