import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useSupabaseStorage } from '../../../hooks/useSupabaseStorage';
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ProfileAvatar from '../../ui/Dashboard/Profile/ProfileAvatar';
import ProfileForm from '../../ui/Dashboard/Profile/ProfileForm';
import DefaultAddress from '../../ui/Dashboard/Profile/DefaultAddress';

export default function ProfilePage() {
  const { session } = useAuth();
  const { data: profileData } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  const { data: addressData } = useSupabaseRead('shipping_address', {
    filter: { user_id: session?.user.id, is_default: true },
    single: true,
  });

  const { updateData: updateProfileData } = useSupabaseWrite('profiles');
  const { updateData: updateAddressData, insertData: insertAddressData } =
    useSupabaseWrite('shipping_address');
  const { uploadFile } = useSupabaseStorage('profile-images');

  const [localProfile, setLocalProfile] = useState({});
  const [localAddress, setLocalAddress] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    if (profileData) {
      setLocalProfile(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (addressData) {
      setLocalAddress(addressData);
    }
  }, [addressData]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [selectedFile]);

  const onSubmitProfile = async (formData) => {
    setIsEditingAddress(true);
    try {
      let avatarUrl = localProfile.avatar_url;

      if (selectedFile) {
        const { data: uploaded } = await uploadFile(
          `${session?.user.id}`,
          selectedFile,
          true
        );
        avatarUrl = uploaded.publicUrl;
      }

      const updatedProfile = { ...formData, avatar_url: avatarUrl };
      const { error } = await updateProfileData(
        { id: session?.user.id },
        updatedProfile
      );

      if (!error) {
        setLocalProfile(updatedProfile);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsEditingProfile(false);
    }
  };

  const onSubmitAddress = async (formData) => {
    setIsEditingAddress(true);
    try {
      const updatedAddress = {
        user_id: session?.user.id,
        ...formData,
        is_default: true,
      };

      let error;
      if (localAddress?.id) {
        ({ error } = await updateAddressData(
          { id: localAddress.id },
          updatedAddress
        ));
      } else {
        ({ error } = await insertAddressData([updatedAddress]));
      }

      if (!error) {
        setLocalAddress(updatedAddress);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setIsEditingAddress(false);
    }
  };

  return (
    <div className='flex flex-col w-full items-center mt-4 mb-16'>
      <h1 className='text-3xl w-full font-bold'>Account Details</h1>
      <div className='flex flex-row w-full mt-4 gap-16'>
        <ProfileAvatar
          avatarUrl={previewUrl || localProfile.avatar_url}
          username={localProfile.username}
          email={session?.user?.email}
          setSelectedFile={setSelectedFile}
        />

        <div className='flex flex-col w-full px-4 gap-16'>
          <ProfileForm
            localProfile={localProfile}
            onSubmit={onSubmitProfile}
            isLoading={isEditingProfile}
          />
          <DefaultAddress
            localAddress={localAddress}
            isEditing={isEditingAddress}
            onSubmit={onSubmitAddress}
          />
        </div>
      </div>
    </div>
  );
}
