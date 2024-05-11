import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, updateDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../Firebase';
import NavigationBar from '../NavigationBar';
import ProfileHeader from './ProfileHeader';
import ServiceList from './ServiceList';
import EditProfileModal from './EditProfileModal';
import ServiceModal from './ServiceModal';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { username } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', currency: 'USD' });
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        // If username is provided in the URL, fetch the profile based on the username
        const profilesRef = collection(db, 'profiles');
        const q = query(profilesRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data();
          setProfile({ ...profileData, userId: querySnapshot.docs[0].id });
        } else {
          // Handle case when profile is not found
          console.log('Profile not found');
        }
      } else {
        // If username is not provided, check if the user is signed in and fetch their profile
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            setIsAuthenticated(true);
            const profileRef = doc(db, "profiles", user.uid);
            const profileSnapshot = await getDoc(profileRef);

            if (profileSnapshot.exists()) {
              setProfile({ ...profileSnapshot.data(), userId: user.uid });
            } else {
              // Handle case when profile is not found for the signed-in user
              console.log('Profile not found for the signed-in user');
            }
          } else {
            // If the user is not signed in, redirect to the login page
            navigate('/login');
          }
        });

        return () => unsubscribe();
      }
    };

    fetchProfile();
  }, [username, navigate]);

  const updateProfile = async (updates) => {
    if (updates.username && updates.username !== profile.username) {
      const isUnique = await checkUsernameUnique(updates.username);
      if (!isUnique) {
        setUsernameAvailable(false);
        return;
      }
    }

    const profileRef = doc(db, "profiles", profile.userId);
    await updateDoc(profileRef, updates);
    setProfile(prev => ({ ...prev, ...updates }));
    setUsernameAvailable(true);
    setShowModal(false);
  };

  const checkUsernameUnique = async (username) => {
    const usersRef = collection(db, "profiles");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleEditProfile = () => {
    setModalContent('editProfile');
    setShowModal(true);
  };

  const handleAddService = () => {
    setModalContent('addService');
    setShowModal(true);
  };

  const addService = async () => {
    const profileRef = doc(db, "profiles", profile.userId);
    await updateDoc(profileRef, { services: [...profile.services, newService] });
    setProfile(prev => ({ ...prev, services: [...prev.services, newService] }));
    setShowModal(false);
  };

  const deleteService = async (serviceToDelete) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedServices = profile.services.filter(service => service !== serviceToDelete);
      const profileRef = doc(db, "profiles", profile.userId);
      await updateDoc(profileRef, { services: updatedServices });
      setProfile(prev => ({ ...prev, services: updatedServices }));

      if (serviceToDelete.image) {
        const storageRef = ref(storage, serviceToDelete.image);
        await deleteObject(storageRef);
      }
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profilePictures/${profile.userId}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    updateProfile({ profilePicture: photoURL });
  };

  const handleServiceImageUpload = async (e, service) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `serviceImages/${service.name}_${profile.userId}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    const updatedServices = profile.services.map(s => {
      if (s === service) {
        return { ...s, image: imageUrl };
      }
      return s;
    });

    const profileRef = doc(db, "profiles", profile.userId);
    await updateDoc(profileRef, { services: updatedServices });
    setProfile(prev => ({ ...prev, services: updatedServices }));
  };

  const handleServiceClick = (service) => {
    setModalContent(service);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setNewService(service);
    setModalContent('editService');
    setShowModal(true);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated && <NavigationBar />}
      <div className="flex flex-col items-center pt-10 relative w-3/4 mx-auto">
      <ProfileHeader
          profile={profile}
          handleEditProfile={isAuthenticated ? handleEditProfile : undefined}
          handleProfilePictureChange={isAuthenticated ? handleProfilePictureChange : undefined}
          isAuthenticated={isAuthenticated}
      />
        <h3 className="text-lg font-bold text-gray-800 mt-8 w-full text-center">Services</h3>
        <ServiceList
            services={profile.services}
            handleAddService={isAuthenticated ? handleAddService : undefined}
            handleServiceClick={handleServiceClick}
            deleteService={isAuthenticated ? deleteService : undefined}
            handleServiceImageUpload={isAuthenticated ? handleServiceImageUpload : undefined}
            hoveredServiceIndex={hoveredServiceIndex}
            setHoveredServiceIndex={setHoveredServiceIndex}
            isAuthenticated={isAuthenticated}
        />
        {isAuthenticated && (
          <button
            className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        )}
        {showModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-end">
                <FontAwesomeIcon icon={faTimes} onClick={() => setShowModal(false)} className="p-1 cursor-pointer hover:text-gray-600 transition" />
              </div>
              {modalContent === 'editProfile' && (
                <EditProfileModal
                  profile={profile}
                  setProfile={setProfile}
                  updateProfile={updateProfile}
                  usernameAvailable={usernameAvailable}
                  handleProfilePictureChange={handleProfilePictureChange}
                />
              )}
              {(modalContent === 'addService' || modalContent === 'editService') && (
                <ServiceModal
                  newService={newService}
                  setNewService={setNewService}
                  addService={addService}
                />
              )}
              {typeof modalContent === 'object' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{modalContent.name}</h2>
                  <p className="text-gray-500">{modalContent.description}</p>
                  <p className="font-bold">${modalContent.price} {modalContent.currency}</p>
                  <div className="flex justify-between w-full">
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEditService(modalContent)} className="p-1 cursor-pointer hover:text-gray-600 transition" />
                    {isAuthenticated && (
                      <FontAwesomeIcon icon={faTrash} onClick={() => deleteService(modalContent)} className="p-1 cursor-pointer hover:text-red-600 transition" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;