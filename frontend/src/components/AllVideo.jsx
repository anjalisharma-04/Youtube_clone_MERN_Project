// frontend/src/components/AllVideo.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUserVideos, deleteVideo, resetUserVideos } from '../Redux/slice/videoSlice';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import FormatDate from './FormatDate';

function AllVideo() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const uploadedVideos = useSelector((state) => state.video.userVideos);
  const isLoading = useSelector((state) => state.video?.loading || false);
  const { toast } = useToast();

  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchAllUserVideos(currentUser._id))
        .unwrap()
        .catch((err) => console.error("Failed to load videos:", err));
    }

    return () => {
      dispatch(resetUserVideos());
    };
  }, [currentUser?._id, dispatch]);

  const toggleMenuVisibility = (videoId) => {
    setActiveMenu(activeMenu === videoId ? null : videoId);
  };

  const handleVideoDelete = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(deleteVideo(videoId))
        .unwrap()
        .then(() => {
          toast({ title: "Video deleted successfully." });
        })
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-44">
        <div className="p-4">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 pt-5 xl:grid-cols-3 xl:gap-3">
      <div className="mb-4 col-span-full xl:mb-2">
        <section className="container">
          <div className="grid grid-cols-1 px-4 pt-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
            {uploadedVideos.map((video) => (
              <div key={video._id} className="bg-white m-1 rounded-lg max-w-[360px] relative">
                <div className="relative">
                  <Link to={`/watch/${video._id}`}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </Link>
                </div>
                <div className="p-4 flex">
                  <Link to={`/Channel/${video.channelId._id}`}>
                    <img
                      src={video.channelId.avatar}
                      alt={video.channelId.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  </Link>
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800 line-clamp-2">
                      <Link to={`/watch/${video._id}`} className="hover:text-black">
                        {video.title}
                      </Link>
                    </h3>
                    <Link to={`/Channel/${video.channelId._id}`}>
                      <h4 className="text-sm text-gray-500 hover:text-black">{video.channelId.name}</h4>
                    </Link>
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <span>{video.views} views</span>
                      <span className="ml-2">
                        <FormatDate dateString={video.createdAt} />
                      </span>
                    </div>
                    <button
                      onClick={() => toggleMenuVisibility(video._id)}
                      className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-800"
                    >
                      &#8230;
                    </button>

                    {activeMenu === video._id && (
                      <div className="absolute bottom-10 right-2 bg-white border shadow-md rounded-lg w-40">
                        <button
                          onClick={() => handleVideoDelete(video._id)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                        <Link
                          to={`update/${video._id}`}
                          className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AllVideo;
