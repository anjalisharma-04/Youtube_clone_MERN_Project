// frontend/src/page/Channel.jsx
import React, { useEffect, useState } from 'react';  
import { useSelector, useDispatch } from 'react-redux';  
import { useParams, Link } from 'react-router-dom';  
import axios from 'axios';  
import { subscribeChannel, unsubscribeChannel } from '../Redux/slice/channelSlice'; 
import { fetchAllUserVideos } from '../Redux/slice/videoSlice';  
import { useToast } from '../hooks/use-toast';  
import FormatDate from '../components/FormatDate';  

const Channel = () => {
    const { id } = useParams();  
    const [channelData, setChannelData] = useState(null);  
    const [loading, setLoading] = useState(true);  
    const { toast } = useToast();  
    const dispatch = useDispatch();  
    const authStatus = useSelector((state) => state.auth.status);  
    const userId = useSelector((state) => state.auth.user?._id);  
    const [isSubscribed, setIsSubscribed] = useState(false);  
    const [videos, setVideos] = useState([]);  
    
    // Effect hook to fetch channel data based on the channel ID from URL params
    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                // Make a request to fetch channel data
                const response = await axios.get(`http://localhost:8000/api/v1/channel/data/${id}`);
                if (response.data.message === "Channel fetched successfully") {
                    setChannelData(response.data.data);  // Set channel data if successful
                }
            } catch (error) {
                console.error("Error fetching channel data:", error);  // Log error if the fetch fails
            } finally {
                setLoading(false);  // Set loading state to false after the data is fetched
            }
        };

        fetchChannelData();
    }, [id]);  // Dependency array: re-run effect when the channel ID changes

    // Effect hook to check if the user is subscribed and fetch the channel's videos
    useEffect(() => {
        if (channelData && userId) {
            setIsSubscribed(channelData.subscribers.includes(userId));  // Check if the user is in the subscribers list
        }

        if (channelData) {
            // Dispatch action to fetch videos for the channel and update the state
            dispatch(fetchAllUserVideos(channelData.owner._id)).then((action) => {
                if (action.payload) {
                    setVideos(action.payload);  // Update state with the fetched videos
                }
            });
        }
    }, [channelData, userId, dispatch]);  // Re-run the effect when channelData, userId, or dispatch change

    // Handle subscribing or unsubscribing from the channel
    const handleSubscribe = async () => {
        if (!authStatus) {
            toast({
                variant: "destructive",
                title: "Please log in to subscribe",  // Show a toast if the user is not authenticated
            });
            return;  // Exit if the user is not logged in
        }

        try {
            if (isSubscribed) {
                // Unsubscribe from the channel
                dispatch(unsubscribeChannel(channelData._id));
                toast({
                    title: "Unsubscribed successfully",  // Show success toast on unsubscribe
                });
                console.log("Unsubscribed successfully");
            } else {
                // Subscribe to the channel
                dispatch(subscribeChannel(channelData._id));
                toast({
                    title: "Subscribed successfully",  // Show success toast on subscribe
                });
                console.log("Subscribed successfully");
            }

            // Update the subscription state locally
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.error('Error during subscription:', error);  // Log any error during subscription
            toast({
                variant: "destructive",
                title: "An error occurred. Please try again.",  // Show error toast if something goes wrong
            });
        }
    };

    // Render loading state if the data is still being fetched
    if (loading) {
        return <div className="text-center py-10 text-xl">Loading...</div>;
    }

    // Render a message if no channel data is found
    if (!channelData) {
        return <div className="text-center py-10 text-xl">No channel data found</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4">
            {/* Channel Banner */}
            <div
                className="relative bg-cover bg-center h-60 rounded-lg shadow-md mb-10 mt-10"
                style={{ backgroundImage: `url(${channelData.banner})` }}
            ></div>

            {/* Channel Info (Below Banner) */}
            <div className="flex items-center mb-10">
                {/* Channel Avatar */}
                <img
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md mr-6"
                    src={channelData.avatar}
                    alt={channelData.name}
                />
                <div>
                    {/* Channel Name */}
                    <h1 className="text-4xl font-semibold">{channelData.name}</h1>
                    {/* Channel Handle */}
                    <p className="text-xl text-gray-500">@{channelData.handle}</p>
                    {/* Subscribe Button */}
                    <button
                        onClick={handleSubscribe}
                        className={`text-white p-2 ml-3 rounded-full px-4 ${isSubscribed ? 'bg-gray-500' : 'bg-black'}`}
                    >
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}  {/* Button text changes based on subscription state */}
                    </button>
                </div>
            </div>

            {/* Videos Section */}
            <h1 className='text-2xl font-bold'>Home</h1>
            <div className="grid grid-cols-1 px-4 pt-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
                {videos.map((video) => (
                    <div key={video._id} className="bg-white rounded-lg max-w-[360px] m-1">
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
                                        <FormatDate dateString={video.createdAt} /> {/* Format the video's creation date */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Channel;
