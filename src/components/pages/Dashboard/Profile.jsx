import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useSupabaseStorage } from '../../../hooks/useSupabaseStorage';
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../context/ToastContext';

import ProfileAvatar from '../../ui/Dashboard/Profile/ProfileAvatar';
import ProfileForm from '../../ui/Dashboard/Profile/ProfileForm';
import DefaultAddress from '../../ui/Dashboard/Profile/DefaultAddress';

export default function ProfilePage() {
  const { session } = useAuth();
  const { toast } = useToast();

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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

  const onSubmitProfileData = async (formData) => {
    setIsEditingProfile(true);
    try {
      const updatedProfile = {
        ...formData,
        avatar_url: localProfile.avatar_url,
      };

      const { error } = await updateProfileData(
        { id: session?.user.id },
        updatedProfile
      );

      if (!error) {
        setLocalProfile((prev) => ({ ...prev, ...updatedProfile }));
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
      toast.error('An unexpected error occurred while updating profile.');
    } finally {
      setIsEditingProfile(false);
    }
  };

  const onSubmitAvatar = async () => {
    if (!selectedFile) return;

    setIsUploadingAvatar(true);
    try {
      const { data: uploaded, error: uploadError } = await uploadFile(
        `${session?.user.id}`,
        selectedFile,
        true
      );

      if (uploadError) {
        toast.error('Failed to upload image. Please try again.');
      }

      if (uploaded?.publicUrl) {
        const avatarUrlWithCacheBust = `${uploaded.publicUrl}?v=${Date.now()}`;

        const { error } = await updateProfileData(
          { id: session?.user.id },
          { avatar_url: avatarUrlWithCacheBust }
        );

        if (!error) {
          setLocalProfile((prev) => ({
            ...prev,
            avatar_url: avatarUrlWithCacheBust,
          }));
          setSelectedFile(null);
          toast.success('Profile picture updated successfully!');
        } else {
          toast.error('Failed to update profile picture. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('An unexpected error occurred while updating avatar.');
    } finally {
      setIsUploadingAvatar(false);
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
        toast.success(
          localAddress?.id
            ? 'Address updated successfully!'
            : 'Address added successfully!'
        );
      } else {
        toast.error('Failed to save address. Please try again.');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('An unexpected error occurred while saving address.');
    } finally {
      setIsEditingAddress(false);
    }
  };

  console.log(localAddress);

  return (
    <div className='flex flex-col w-full items-center mt-2 mb-8'>

      <div className='flex flex-row w-full mt-2 gap-8'>
        <ProfileAvatar
          avatarUrl={previewUrl || localProfile.avatar_url}
          username={localProfile.username}
          email={session?.user?.email}
          setSelectedFile={setSelectedFile}
          onSubmitAvatar={onSubmitAvatar}
          isUploadingAvatar={isUploadingAvatar}
          hasSelectedFile={!!selectedFile}
        />

        <div className='flex flex-col w-full px-2 gap-8'>
          <ProfileForm
            localProfile={localProfile}
            onSubmit={onSubmitProfileData}
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
