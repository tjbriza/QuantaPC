import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useSupabaseStorage } from '../../../hooks/useSupabaseStorage';
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ProfileAvatar from '../../ui/Profile/ProfileAvatar';
import ProfileForm from '../../ui/Profile/ProfileForm';
import DefaultAddress from '../../ui/Profile/DefaultAddress';

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

  const { updateData: updateProfileData, insertData: insertProfileData } =
    useSupabaseWrite('profiles');

  const { updateData: updateAddressData, insertData: insertAddressData } =
    useSupabaseWrite('shipping_address');

  const { uploadFile } = useSupabaseStorage('profile-images');

  const [localProfile, setLocalProfile] = useState({});
  const [localAddress, setLocalAddress] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
  } = useForm({
    defaultValues: localProfile,
  });

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
  } = useForm({
    defaultValues: localAddress,
  });

  useEffect(() => {
    if (profileData) {
      setLocalProfile(profileData);
      resetProfile(profileData);
    }
  }, [profileData, resetProfile]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [selectedFile]);

  useEffect(() => {
    if (addressData) {
      setLocalAddress(addressData);
      resetAddress(addressData);
    }
  }, [addressData, resetAddress]);

  const onSubmitProfile = async (formData) => {
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
      setIsEditingProfile(false);
      setSelectedFile(null);
    }
  };

  const onSubmitAddress = async (formData) => {
    const updatedAddress = {
      user_id: session?.user.id,
      full_name: formData.full_name,
      phone_number: formData.phone_number, // ✅ must match schema
      country: formData.country,
      region: formData.region,
      province: formData.province,
      city: formData.city,
      barangay: formData.barangay,
      postal_code: formData.postal_code,
      street_name: formData.street_name,
      building_name: formData.building_name || null,
      house_number: formData.house_number,
      address_label: formData.address_label || 'Home',
      is_default: true, // ✅ schema column name
    };

    let error;

    if (localAddress?.id) {
      // Update existing
      ({ error } = await updateAddressData(
        { id: localAddress.id }, // ✅ safer filter
        updatedAddress
      ));
    } else {
      // Insert new (needs array!)
      ({ error } = await insertAddressData([updatedAddress]));
    }

    if (!error) {
      setLocalAddress(updatedAddress);
      setIsEditingAddress(false);
      resetAddress(updatedAddress);
    }
  };

  return (
    <div className='flex flex-col w-full h-svh items-center mt-4'>
      <h1 className='text-3xl w-full font-bold'>Account Details</h1>
      <div className='flex flex-row w-full mt-4 gap-16'>
        <ProfileAvatar
          avatarUrl={previewUrl || localProfile.avatar_url}
          username={localProfile.username}
          email={session?.user?.email}
          isEditing={isEditingProfile}
          setSelectedFile={setSelectedFile}
        />

        <div className='flex flex-col w-full px-4 gap-16'>
          <ProfileForm
            register={registerProfile}
            localProfile={localProfile}
            isEditing={isEditingProfile}
            setIsEditing={setIsEditingProfile}
            handleSubmit={handleSubmitProfile}
            onSubmit={onSubmitProfile}
            reset={resetProfile}
            setSelectedFile={setSelectedFile}
          />
          <DefaultAddress
            register={registerAddress}
            localAddress={localAddress}
            isEditing={isEditingAddress}
            setIsEditing={setIsEditingAddress}
            handleSubmit={handleSubmitAddress}
            onSubmit={onSubmitAddress}
            reset={resetAddress}
          />
        </div>
      </div>
    </div>
  );
}
