import { Brush } from 'lucide-react';

export default function AddressForm({
  register,
  localAddress,
  isEditing,
  setIsEditing,
  handleSubmit,
  onSubmit,
  reset,
}) {
  return (
    <div className='w-full'>
      <div className='flex gap-8 items-center'>
        <h2 className='text-3xl font-bold'>Default Shipping Address</h2>

        {!isEditing ? (
          <button
            className='px-4 py-2 text-black rounded flex gap-2 hover:underline'
            onClick={() => setIsEditing(true)}
          >
            {localAddress ? 'Edit' : 'Add'}{' '}
            <Brush className='w-6 h-6 text-gray-500' />
          </button>
        ) : (
          <div className='flex gap-2'>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded'
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
            <button
              className='px-4 py-2 bg-gray-300 rounded'
              onClick={() => {
                reset(localAddress || {}); // reset to existing address or empty
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className='flex flex-row flex-wrap mt-4 gap-8'>
        {[
          'full_name',
          'phone_number',
          'country',
          'region',
          'province',
          'city',
          'barangay',
          'postal_code',
          'street_name',
          'building_name',
          'house_number',
          'address_label',
        ].map((field) => (
          <div key={field} className='flex flex-col gap-2 min-w-[200px]'>
            <p className='text-lg font-medium'>
              {field
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              :
            </p>
            {isEditing ? (
              <input {...register(field)} className='border p-1 rounded' />
            ) : (
              <p>{localAddress?.[field] || '-'}</p>
            )}
          </div>
        ))}
      </div>

      {!localAddress && !isEditing && (
        <p className='mt-4 text-red-500'>
          Add an address to continue shopping!
        </p>
      )}
    </div>
  );
}
