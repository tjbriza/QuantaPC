import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../../../schema/ProfileSchemas';
import { Save, X } from 'lucide-react';

export default function AddNewAddressForm({ onSave, onCancel, isLoading }) {
  const form = useForm({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      phone_number: '',
      country: 'Philippines',
      region: 'NCR',
      province: 'Metro Manila',
      city: '',
      barangay: '',
      postal_code: '',
      street_name: '',
      building_name: '',
      house_number: '',
      address_label: '',
    },
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

  return (
    <div className='w-full mb-8 p-6 border-2 border-blue-50  rounded-lg bg-blue-50'>
      <div className='flex gap-4 items-center mb-4'>
        <h2 className='text-2xl font-bold'>Add New Address</h2>
        <div className='flex gap-2'>
          <button
            className='px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 flex items-center gap-2'
            onClick={form.handleSubmit(onSave)}
            disabled={isLoading || !form.formState.isValid}
          >
            <Save className='w-4 h-4' />
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            className='px-4 py-2 bg-gray-300 rounded flex items-center gap-2'
            onClick={onCancel}
          >
            <X className='w-4 h-4' />
            Cancel
          </button>
        </div>
      </div>

      <div className='flex flex-row flex-wrap gap-8'>
        {addressFields.map(({ key, label }) => (
          <div key={key} className='flex flex-col gap-2 min-w-[200px]'>
            <p className='text-lg font-bold'>{label}:</p>
            <div>
              <input
                {...form.register(key)}
                className={`border p-2 rounded w-full ${
                  form.formState.errors[key]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder={key === 'building_name' ? 'Optional' : ''}
              />
              {form.formState.errors?.[key]?.message && (
                <p className='text-red-500 text-sm mt-1'>
                  {form.formState.errors[key].message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
