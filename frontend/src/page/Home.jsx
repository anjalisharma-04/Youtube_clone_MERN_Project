 // frontend/src/page/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllVideos } from "../Redux/slice/videoSlice";
import { useOutletContext } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import FormatDate from "../components/FormatDate";
import axios from "axios";

// Utility function to shuffle an array
const shuffleArray = (array) => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

function Home() {
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.video);
  const { searchTerm } = useOutletContext();
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tagsContainerRef = useRef(null);

  // Fetching videos and tags when the component mounts
  useEffect(() => {
    dispatch(fetchAllVideos()); // Dispatch action to fetch all videos

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/tags/getTags");
        const data = response.data.data;
        setTags(shuffleArray(data)); // Shuffle the tags before setting them
        setTimeout(updateScrollButtons, 50);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [dispatch]);

  // Update the visibility of the scroll buttons
  const updateScrollButtons = () => {
    if (tagsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = tagsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
    }
    updateScrollButtons();
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [tags]);

  // Scroll the tags container
  const scrollTags = (direction) => {
    const container = tagsContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Toggle tag selection
  const handleTagClick = (tagName) => {
    setSelectedTag((prevTag) => (prevTag === tagName ? null : tagName));
  };

  // Shuffle and filter videos based on search term and selected tag
  const shuffledVideos = shuffleArray(videos);
  const filteredVideos = shuffledVideos.filter(
    (video) =>
      (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedTag ? video.tags.includes(selectedTag) : true)
  );

  // Render UI
  return filteredVideos.length === 0 ? (
    <div className="text-center my-72">
      <span>No videos found.</span>
    </div>
  ) : (
    <div className="w-full ml-0 lg:mt-8 bg-white">
      {/* Render tags */}
      <div className="relative flex items-center px-4 py-2 bg-white">
        {canScrollLeft && (
          <button
            onClick={() => scrollTags("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-4 z-10"
          >
            <IoIosArrowBack />
          </button>
        )}

        <div
          className="tags-container overflow-x-auto whitespace-nowrap scrollbar-hide px-4 bg-white flex gap-2"
          ref={tagsContainerRef}
        >
          {tags.map((tag) => (
            <button
              key={tag._id}
              className={`tag-button py-1 px-2 rounded-lg border ${
                selectedTag === tag.name
                  ? "bg-black text-white"
                  : "bg-gray-200 text-sm text-black font-semibold hover:bg-gray-300"
              }`}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scrollTags("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-4 z-10"
          >
            <IoIosArrowForward />
          </button>
        )}
      </div>

      {/* Render videos */}
      <div className="grid grid-cols-1 px-4 pt-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
        {filteredVideos.map((video) => (
          <div key={video._id} className="bg-white rounded-lg max-w-[360px]">
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
                  <h4 className="text-sm text-gray-500 hover:text-black">
                    {video.channelId.name}
                  </h4>
                </Link>
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <span>{video.views} views</span>
                  <span className="ml-2">
                    <FormatDate dateString={video.createdAt} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
