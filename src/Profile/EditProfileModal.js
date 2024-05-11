import React, { useState } from 'react';

const EditProfileModal = ({ profile, setProfile, updateProfile, usernameAvailable, handleProfilePictureChange }) => {
  const [preview, setPreview] = useState(profile.profilePicture || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    handleProfilePictureChange(e);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          {preview ? (
            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <input type="file" id="profilePicture" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
        </div>
        <label htmlFor="profilePicture" className="mt-2 text-sm text-gray-700 cursor-pointer">Change Profile Picture</label>
      </div>
      <input type="text" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full p-2 border rounded mt-4" />
      <input type="text" placeholder="Username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="w-full p-2 border rounded my-2" />
      {!usernameAvailable && <p className="text-red-500 text-xs">Username is already taken.</p>}
      <textarea placeholder="Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full p-2 border rounded my-2" rows="3"></textarea>
      <button onClick={() => updateProfile({ name: profile.name, username: profile.username, bio: profile.bio })} className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200">Update Profile</button>
    </div>
  );
};

export default EditProfileModal;