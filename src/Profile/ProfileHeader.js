import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const ProfileHeader = ({ profile, handleEditProfile, handleProfilePictureChange, isAuthenticated }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center overflow-hidden relative">
                {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <FontAwesomeIcon icon={faUser} size="4x" className="text-gray-500" />
                )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500">@{profile.username}</p>
            <p className="mt-4 text-gray-600">{profile.bio}</p>
            {isAuthenticated && (
                <button className="mt-2 text-sm text-gray-500 hover:text-gray-600" onClick={handleEditProfile}>
                    Edit Profile
                </button>
            )}
        </div>
    );
};

export default ProfileHeader;