// frontend/src/components/Recommendation.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Recommendation = ({ currentVideoTags, currentVideoId }) => {
  const [suggestedVideos, setSuggestedVideos] = useState([]);

  // Access all videos from the Redux store
  const allVideos = useSelector((state) => state.video.videos);

  // When the list of all videos or current video data changes, update recommendations
  useEffect(() => {
    if (allVideos && currentVideoTags) {
      const matches = allVideos.filter(
        (video) =>
          video._id !== currentVideoId &&
          video.tags.some((tag) => currentVideoTags.includes(tag))
      );
      setSuggestedVideos(matches);
    }
  }, [allVideos, currentVideoTags, currentVideoId]);

  // Show a message if no suggestions are found
  if (!suggestedVideos.length) {
    return <p>No related videos available at the moment.</p>;
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="mb-4 text-lg font-semibold">Up Next</h2>

      {suggestedVideos.map((video) => (
        <Link to={`/watch/${video._id}`} key={video._id} className="flex gap-4">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-20 rounded-md object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
            <p className="text-xs text-gray-500">
              {video.channelId.name} · {video.views} views
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Recommendation;
