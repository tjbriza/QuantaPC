import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../../../schema/ProfileSchemas';
import { Brush, User } from 'lucide-react';

export default function ProfileForm({
  localProfile,
  onSubmit,
  isLoading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    mode: onchange,
    defaultValues: localProfile || {},
    values: localProfile,
  });

  const handleSave = async (formData) => {
    await onSubmit(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset(localProfile);
    setIsEditing(false);
  };

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
              disabled={isLoading || !form.formState.isValid}
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
        {[
          { key: 'username', label: 'Username:' },
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
      </div>
    </div>
  );
}
