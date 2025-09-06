import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../../../schema/ProfileSchemas';
import { Brush } from 'lucide-react';

export default function DefaultAddress({
  localAddress,
  onSubmit,
  isLoading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: localAddress || {},
    values: localAddress,
  });

  const handleSave = async (formData) => {
    await onSubmit(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset(localAddress || {});
    setIsEditing(false);
  };

  const addressFields = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'country', label: 'Country' },
    { key: 'region', label: 'Region' },
    { key: 'province', label: 'Province' },
    { key: 'city', label: 'City' },
    { key: 'barangay', label: 'Barangay' },
    { key: 'postal_code', label: 'Postal Code' },
    { key: 'street_name', label: 'Street Name' },
    { key: 'building_name', label: 'Building Name' },
    { key: 'house_number', label: 'House Number' },
    { key: 'address_label', label: 'Address Label' },
  ];

  return (
    <div className='w-full bg-white p-4 rounded-md shadow-sm'>
      <div className='flex gap-4 items-end-safe mb-1 pb-2'>
        <h2 className='text-2xl font-bold'>Default Shipping Address</h2>

        {!isEditing ? (
          <button
            className='px-4 text-black text-xl rounded flex gap-2 hover:underline'
            onClick={() => setIsEditing(true)}
          >
            {localAddress && Object.keys(localAddress).length > 0
              ? 'Edit Address'
              : 'Add'}{' '}
            <Brush className='w-6 h-6' />
          </button>
        ) : (
          <div className='flex gap-2'>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50'
              onClick={form.handleSubmit(handleSave)}
              disabled={
                isLoading || !form.formState.isValid || !form.formState.isDirty
              }
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

      {/* Conditional content */}
      {Object.keys(localAddress).length === 0 && !isEditing ? (
        <p className='mt-4 text-red-500'>
          Add an address to continue shopping!
        </p>
      ) : (
        <div className='flex flex-row flex-wrap mt-4 gap-8'>
          {addressFields.map(({ key, label }) => (
            <div key={key} className='flex flex-col gap-2 min-w-[200px]'>
              <p className='text-lg font-bold'>{label}:</p>
              {isEditing ? (
                <div>
                  <input
                    {...form.register(key)}
                    className={`border p-1 rounded w-full ${
                      form.formState.errors[key]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {form.formState.errors?.[key]?.message && (
                    <p className='text-red-500 text-sm mt-1'>
                      {form.formState.errors[key].message}
                    </p>
                  )}
                </div>
              ) : (
                <p className='p-1'>{localAddress?.[key] || '-'}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
