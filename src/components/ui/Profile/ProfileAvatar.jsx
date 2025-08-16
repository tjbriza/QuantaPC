export default function ProfileAvatar({
  avatarUrl,
  username,
  email,
  isEditing,
  setSelectedFile,
}) {
  return (
    <div className='flex flex-col items-start gap-4'>
      <img
        src={avatarUrl}
        alt='Profile'
        className='rounded-full w-60 h-50 object-cover'
      />
      {isEditing && (
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      )}
      <div>
        <p>{username}</p>
        <p>{email}</p>
      </div>
    </div>
  );
}
