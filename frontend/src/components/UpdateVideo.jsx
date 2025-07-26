import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoById, updateVideo } from '../Redux/slice/videoSlice';
import { useToast } from '../hooks/use-toast';
import { HiPlus } from 'react-icons/hi';

function UpdateVideo() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { video, loading } = useSelector((state) => state.video);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Load video data for editing
  useEffect(() => {
    dispatch(fetchVideoById(id));
  }, [dispatch, id]);

  // Fill form with current video info
  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setTags(video.tags?.join(', ') || '');
    }
  }, [video]);

  // File handlers
  const onThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const onVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Handle update form submit
  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('tags', tags);

    if (thumbnail) data.append('thumbnail', thumbnail);
    if (videoFile) data.append('videoFile', videoFile);

    try {
      setUpdating(true);
      await dispatch(updateVideo({ id, formData: data })).unwrap();
      toast({ title: 'Video updated successfully' });
      dispatch(fetchVideoById(id));
      navigate('/your_channel');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-44">
        <p className="text-lg">Loading video details...</p>
      </div>
    );
  }

  return (
    <div className="text-left">
      <form onSubmit={handleUpdate} className="p-4 md:p-5 w-[800px]">
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="thumbnail" className="block mb-2 text-sm font-medium text-gray-900">
              Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
              onChange={onThumbnailChange}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="videoFile" className="block mb-2 text-sm font-medium text-gray-900">
              Video File
            </label>
            <input
              type="file"
              id="videoFile"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
              onChange={onVideoFileChange}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. tech, music, education"
              required
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="text-white inline-flex items-center bg-gray-700 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <HiPlus size={20} className="mr-2" />
          {updating ? 'Updating...' : 'Update Video'}
        </button>
      </form>
    </div>
  );
}

export default UpdateVideo;
