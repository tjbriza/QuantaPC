import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseWrite } from '../../hooks/useSupabaseWrite';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { Navigate } from 'react-router-dom';
import { FileImage } from 'lucide-react';

export default function ProfileSetup() {
  const { uploadFile } = useSupabaseStorage('profile-images');
  const { insertData, loading, error } = useSupabaseWrite('profiles');
  const { session, signOut } = useAuth();
  const [formdata, setFormData] = useState({
    id: session?.user?.id || '',
    name_first: '',
    name_last: '',
    username: '',
    avatar_url: '',
  });
  const [fileName, setFileName] = useState('No file chosen');

  const navigate = useNavigate();

  // Check if the user already has a profile
  const { data: existingProfile, error: readError } = useSupabaseRead(
    'profiles',
    {
      filter: { id: session?.user?.id },
      single: true,
    }
  );
  if (existingProfile) {
    // If a profile already exists, redirect to the dashboard
    return <Navigate to='/dashboard' />;
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
      setFileName(files[0].name);
    }
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.avatar_url) {
      alert('Please upload a profile picture.');
      return;
    }
    // Upload the avatar image to Supabase Storage
    const { data: uploadData, error: uploadError } = await uploadFile(
      `${formdata.id}`,
      formdata.avatar_url
    );

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      alert('Failed to upload profile picture. Please try again.');
      return;
    }
    // Get the public URL of the uploaded image
    const avatarUrl = uploadData.publicUrl;

    const newProfile = {
      id: formdata.id,
      name_first: formdata.name_first,
      name_last: formdata.name_last,
      username: formdata.username,
      avatar_url: avatarUrl,
    };

    const result = await insertData(newProfile);

    if (result.error) {
      console.error('Error creating profile:', result.error);
    } else {
      alert('Profile created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className='relative h-screen overflow-hidden' style={{ backgroundColor: '#EEEEEE', backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Logo in top left */}
      <Link 
        to="/" 
        className="absolute top-8 left-32 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
      >
        <img 
          src="/images/logo.png"
          alt="Quanta PC" 
          className="h-12 w-auto transition-all duration-300"
        />
      </Link>

      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-none" style={{ width: '500px' }}>
          <div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            style={{ 
              border: '1px solid #6E6E6E', 
              boxShadow: '0 0 12px rgba(0, 0, 0, 0.6)' 
            }}
          >
            <h1 className="text-2xl font-semibold text-white text-center mb-8 font-heading">
              Almost done!
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name_first" className="text-black text-lg block mb-2 font-heading">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div>
                  <input
                    id="name_first"
                    name="name_first"
                    type="text"
                    className="bg-black/40 border border-white/20 text-white placeholder:text-white/50 rounded-full h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-black/50"
                    placeholder=""
                    required={true}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="name_last" className="text-black text-lg block mb-2 font-heading">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div>
                  <input
                    id="name_last"
                    name="name_last"
                    type="text"
                    className="bg-black/40 border border-white/20 text-white placeholder:text-white/50 rounded-full h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-black/50"
                    placeholder=""
                    required={true}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="username" className="text-black text-lg block mb-2 font-heading">
                  Username
                </label>
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="bg-black/40 border border-white/20 text-white placeholder:text-white/50 rounded-full h-12 w-full px-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-black/50"
                    placeholder=""
                    required={true}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="avatar_url" className="text-black text-lg block mb-2 font-heading">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor="avatar_url" 
                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-full h-12 px-6 font-medium transition-colors duration-200 flex items-center cursor-pointer font-heading"
                    style={{ 
                      border: '1px solid #6E6E6E', 
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)' 
                    }}
                  >
                    Choose File
                    <input
                      id="avatar_url"
                      name="avatar_url"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      required={true}
                      onChange={handleChange}
                    />
                  </label>
                  <span className="text-black">{fileName}</span>
                </div>
              </div>

              {error && (
                <div className="text-red-300 text-sm text-center mb-4">An error occured, please try again: {error}</div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-full h-12 font-medium transition-colors duration-200 font-heading"
                style={{ 
                  border: '1px solid #6E6E6E', 
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)' 
                }}
              >
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
