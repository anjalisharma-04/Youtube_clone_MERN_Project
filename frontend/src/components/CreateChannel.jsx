// frontend/src/components/CreateChannel.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createChannel, clearError, clearSuccessMessage } from "../Redux/slice/channelSlice";
import { getUserData } from "../Redux/slice/authSlice";
import { useToast } from "../hooks/use-toast";

const CreateChannel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { error, successMessage } = useSelector((state) => state.channel);
  const userId = useSelector((state) => state.auth.user._id);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'handle') setHandle(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || !handle.trim()) {
      dispatch(clearError());
      setLoading(false);
      return;
    }

    const result = await dispatch(createChannel({ name, handle }));

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserData(userId));
      onClose();
      toast({ title: "Channel Created Successfully" });
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">Create Your Channel</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Channel Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="Your Channel Name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="handle" className="block text-sm font-medium text-gray-600">
              Channel Handle
            </label>
            <input
              id="handle"
              name="handle"
              type="text"
              value={handle}
              onChange={handleInputChange}
              placeholder="@yourhandle"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
