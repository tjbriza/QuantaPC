import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useAuth } from '../../../context/AuthContext';
export default function Profile() {
  const { session } = useAuth();
  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });
  console.log(session);
  const userProfile = data || {};

  console.log(userProfile);
  return (
    <div className='flex flex-col w-full h-svh items-center justify-start mt-4'>
      <h1 className='text-3xl w-full font-bold'>Account Details</h1>
      <div className='container flex flex-column w-full px-4 mt-8 gap-16'>
        <div className='flex flex-col items-start justify-center mb-4 gap-4'>
          <img
            src={userProfile.avatar_url}
            alt='Profile Picture'
            className='rounded-full'
          />
          <div>
            <p>{userProfile.username}</p>
            <p>{session?.user?.email}</p>
          </div>
        </div>
        <div className='w-full'>
          <h2 className='text-3xl font-bold'>PROFILE</h2>
          <div className='flex flex-row gap-16 mt-4'>
            <p className='text-lg font-medium'>
              Username: {userProfile.username}
            </p>
            <p className='text-lg font-medium'>
              First Name: {userProfile.name_first}
            </p>
            <p className='text-lg font-medium'>
              Last Name: {userProfile.name_last}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
