// frontend/src/components/EditAccount.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateAccount } from '../Redux/slice/authSlice';
import { useToast } from '../hooks/use-toast';

const EditAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = useSelector((state) => state.auth.user);

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserData(user._id));
    }
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (user && !profileData) {
      setProfileData(user);
      setFullName(user.name);
      setEmailAddress(user.email);
      setUserPassword(user.password);
    }
  }, [user]);

  const onAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', fullName);
    payload.append('email', emailAddress);
    payload.append('password', userPassword);
    if (avatar) payload.append('avatar', avatar);

    try {
      setIsLoading(true);
      await dispatch(updateAccount({ userId: profileData._id, formData: payload }));
      toast({ title: 'Profile updated successfully' });
      navigate('/settings');
    } catch (error) {
      console.error('Update failed:', error);
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  if (isLoading) {
    return (
      <div className="text-center my-72">
        <div role="status" className="p-4">
          <span>Updating...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        {profileData ? (
          <form
            onSubmit={handleFormSubmit}
            encType="multipart/form-data"
            className="max-w-3xl"
          >
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mb-3 bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
            />

            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              className="mb-3 bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
            />

            <label htmlFor="avatar" className="block mb-1 text-sm font-medium text-gray-900">
              Profile Image
            </label>
            <input
              id="avatar"
              type="file"
              onChange={onAvatarChange}
              className="mb-3 bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
            />

            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              className="mb-4 bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-700 hover:bg-black text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div>Fetching user details...</div>
        )}
      </div>
    </div>
  );
};

export default EditAccount;
