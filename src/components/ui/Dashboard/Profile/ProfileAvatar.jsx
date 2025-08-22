import { Mail, User, Upload, X } from 'lucide-react';

export default function ProfileAvatar({
  avatarUrl,
  username,
  email,
  setSelectedFile,
  onSubmitAvatar,
  isUploadingAvatar,
  hasSelectedFile,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
  };
  console.log(avatarUrl);
  return (
    <div className='flex flex-col items-start gap-4'>
      <div className='relative'>
        <img
          src={avatarUrl || 'https://placehold.co/200x200'}
          alt='Profile'
          className='rounded-full w-50 h-50 object-cover'
        />
        <label className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-50 transition-opacity cursor-pointer rounded-full'>
          <Upload className='w-8 h-8 text-white' />
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      </div>
      <p className='text-sm text-center w-full'>
        hover to change profile picture
      </p>

      {hasSelectedFile && (
        <div className='flex gap-2 w-full'>
          <button
            onClick={onSubmitAvatar}
            disabled={isUploadingAvatar}
            className='flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isUploadingAvatar ? 'Uploading...' : 'Upload Photo'}
          </button>
          <button
            onClick={handleCancelUpload}
            disabled={isUploadingAvatar}
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <p className='flex gap-2'>
          <User />
          {username || 'No username set'}
        </p>
        <p className='flex gap-2'>
          <Mail />
          {email}
        </p>
      </div>
    </div>
  );
}
