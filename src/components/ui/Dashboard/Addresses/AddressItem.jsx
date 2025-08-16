import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../../../schema/ProfileSchemas';
import { Edit3, Trash2, Star, StarOff, Save, X } from 'lucide-react';

export default function AddressItem({
  address,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onSetDefault,
  isLoading,
  isDeletingThis,
}) {
  const form = useForm({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: address,
    values: address,
  });

  const addressFields = [
    { key: 'address_label', label: 'Address Label' },
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
  ];

  const handleCancel = () => {
    form.reset(address);
    onCancel();
  };

  return (
    <div
      className={`w-full p-6 rounded-lg border-2 ${
        address.is_default
          ? 'border-slate-500 '
          : isEditing
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 '
      } shadow-sm`}
    >
      <div className='flex gap-4 items-center mb-4'>
        <h2 className='text-2xl font-bold flex items-center gap-2'>
          {address.address_label}
          {address.is_default && (
            <Star className='w-5 h-5 text-blue-600 fill-current' />
          )}
        </h2>

        {!isEditing ? (
          <div className='flex gap-2'>
            {!address.is_default && (
              <button
                onClick={() => onSetDefault(address.id)}
                className='px-3 py-1 text-sm text-blue-600 hover:underline flex items-center gap-1'
              >
                <StarOff className='w-4 h-4' />
                Set as Default
              </button>
            )}
            <button
              className='px-4 text-black text-xl rounded flex gap-2 hover:underline'
              onClick={() => onEdit(address.id)}
            >
              Edit
              <Edit3 className='w-5 h-5' />
            </button>
            <button
              onClick={() => onDelete(address.id)}
              disabled={isDeletingThis}
              className='px-3 py-1 text-sm text-red-600 hover:underline disabled:opacity-50 flex items-center gap-1'
            >
              <Trash2 className='w-4 h-4' />
              {isDeletingThis ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ) : (
          <div className='flex gap-2'>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 flex items-center gap-2'
              onClick={form.handleSubmit((data) => onSave(address.id, data))}
              disabled={isLoading || !form.formState.isValid}
            >
              <Save className='w-4 h-4' />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              className='px-4 py-2 bg-gray-300 rounded flex items-center gap-2'
              onClick={handleCancel}
            >
              <X className='w-4 h-4' />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Address Fields */}
      <div className='flex flex-row flex-wrap gap-8'>
        {addressFields.map(({ key, label }) => (
          <div key={key} className='flex flex-col gap-2 min-w-[200px]'>
            <p className='text-lg font-bold'>{label}:</p>
            {isEditing ? (
              <div>
                <input
                  {...form.register(key)}
                  className={`border p-2 rounded w-full ${
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
              <p className='p-2'>{address[key] || '-'}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
