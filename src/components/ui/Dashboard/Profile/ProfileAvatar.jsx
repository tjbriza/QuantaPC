import { Mail, User } from 'lucide-react';
export default function ProfileAvatar({
  avatarUrl,
  username,
  email,
  isEditing,
  onFileChange,
}) {
  return (
    <div className='flex flex-col items-start gap-4'>
      <img
        src={avatarUrl}
        alt='Profile'
        className='rounded-full w-60 h-50 object-cover'
      />
      {/* {isEditing && (
        <input
          type='file'
          accept='image/*'
          onChange={(e) => onFileChange?.(e.target.files[0])}
          className='text-sm'
        />
      )} */}
      <div className='flex flex-col gap-2'>
        <p className='flex gap-2'>
          <User />
          {username}
        </p>
        <p className='flex gap-2'>
          <Mail />
          {email}
        </p>
      </div>
    </div>
  );
}
