// frontend/src/components/EditChannel.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateChannel,
  getChannel,
  clearError,
  clearSuccessMessage,
} from '../Redux/slice/channelSlice';
import { useToast } from '../hooks/use-toast';

function EditChannel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { channel, error, successMessage } = useSelector((state) => state.channel);

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    avatar: null,
    banner: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      setFormData((prev) => ({
        ...prev,
        name: channel.name || '',
        handle: channel.handle || '',
        description: channel.description || '',
      }));
    }
  }, [channel]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('handle', formData.handle);
    data.append('description', formData.description);
    if (formData.banner) data.append('banner', formData.banner);
    if (formData.avatar) data.append('avatar', formData.avatar);

    setLoading(true);
    dispatch(updateChannel({ channelId: channel?._id, formData: data }));
  };

  const handleCancel = () => {
    navigate('/your_channel');
  };

  useEffect(() => {
    if (error) {
      toast({ variant: 'destructive', title: `Error: ${error}` });
      dispatch(clearError());
      setLoading(false);
    }
    if (successMessage) {
      toast({ title: successMessage });
      dispatch(clearSuccessMessage());
      navigate('/your_channel');
    }
  }, [error, successMessage, dispatch, navigate, toast]);

  if (loading) {
    return (
      <div className="text-center my-72">
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="col-span-full max-w-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Name</label>
          <p className="mb-3 text-sm text-gray-500">Pick a name that reflects your identity.</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mb-3 input-field"
            placeholder="Channel name"
          />

          <label htmlFor="handle" className="block mb-1 text-sm font-medium text-gray-900">Handle</label>
          <input
            type="text"
            name="handle"
            value={formData.handle}
            onChange={handleChange}
            className="mb-3 input-field"
            placeholder="@yourhandle"
          />

          <label htmlFor="banner" className="block mb-1 text-sm font-medium text-gray-900">Banner</label>
          <p className="mb-3 text-sm text-gray-500">PNG or GIF, 98x98px or larger, max 4MB.</p>
          <input
            type="file"
            name="banner"
            onChange={handleChange}
            className="mb-3 input-field"
          />

          <label htmlFor="avatar" className="block mb-1 text-sm font-medium text-gray-900">Avatar</label>
          <p className="mb-3 text-sm text-gray-500">PNG or GIF, 98x98px or larger, max 4MB.</p>
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            className="mb-3 input-field"
          />

          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mb-4 input-field"
            placeholder="Describe your channel"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="btn bg-gray-700 hover:bg-black text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-blue-700 hover:bg-blue-800 text-white"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditChannel;
