import { Brush } from 'lucide-react';

export default function ProfileForm({
  register,
  localProfile,
  isEditing,
  setIsEditing,
  handleSubmit,
  onSubmit,
  reset,
  setSelectedFile,
}) {
  return (
    <div className='w-full'>
      <div className='flex gap-8 items-center'>
        <h2 className='text-3xl font-bold'>Profile</h2>
        {!isEditing ? (
          <button
            className='px-4 py-2 text-black rounded flex gap-2 hover:underline'
            onClick={() => setIsEditing(true)}
          >
            Edit <Brush className='w-6 h-6 text-gray-500' />
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
                reset(localProfile);
                setSelectedFile(null);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-row mt-4 gap-16'>
        {['username', 'name_first', 'name_last'].map((field) => (
          <div key={field} className='flex flex-col gap-2'>
            <p className='text-lg font-medium'>
              {field === 'username'
                ? 'Username:'
                : field === 'name_first'
                ? 'First Name:'
                : 'Last Name:'}
            </p>
            {isEditing ? (
              <input {...register(field)} className='border p-1 rounded' />
            ) : (
              <p>{localProfile[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
