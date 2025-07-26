// frontend/src/page/Dashboard.jsx
import { useEffect } from "react";  
import React from 'react';  
import { Link, Outlet, useNavigate } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';  
import { MdGridView, MdEqualizer } from "react-icons/md";  
import { getUserData } from '../Redux/slice/authSlice';  
import { deleteChannel } from '../Redux/slice/channelSlice';  
import { useToast } from "../hooks/use-toast";  
import { getChannel } from "../Redux/slice/channelSlice";  

function Dashboard() {
  const data = useSelector((state) => state.auth.user);  
  const channelData = useSelector((state) => state.channel.channel);  
  const navigate = useNavigate();  
  const dispatch = useDispatch();  
  const { toast } = useToast();  
  
  // Effect hook to fetch channel data when the user is available
  useEffect(() => {
    if (data) {
      dispatch(getChannel(data.channelId));  
    }
  }, [data, dispatch]);  

  // Function to handle channel deletion
  const handleDeleteChannel = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your channel? This action cannot be undone.");
    if (!confirmDelete) return;  // If user doesn't confirm, stop the process

    try {
      dispatch(deleteChannel(data.channelId));  // Dispatch delete channel action
      toast({
        title: "Channel Deleted Successfully",
        description: "You will be redirected to the home page.",
      });
      navigate("/");  // Navigate to the homepage after deletion
      dispatch(getUserData(data._id));  // Fetch updated user data
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast({
        variant: "destructive",
        title: "Error deleting channel",
      });
    }
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };  // Options for the date format
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);  // Return the formatted date
  };

  return (
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        {/* Channel Banner */}
        <div className="w-full ml-2 mb-4 col-span-full xl:mb-2">
          {channelData && (
            <img className="w-full h-36 rounded-sm" src={channelData.banner} alt="Channel Banner" />
          )}
          
          {/* Channel Info */}
          <div className="mt-4 flex items-center gap-5">
            {channelData ? (
              <>
                <img className="w-28 h-28 rounded-full" src={channelData.avatar} alt="Channel Avatar" />
                <div className="font-bold dark:text-black">
                  <div className="text-lg">{(channelData.name || "Admin").toUpperCase()}</div>
                  <div className="text-sm mb-3 text-gray-500">@{(channelData.handle)}</div>
                  <div className="text-sm mb-3 text-gray-500">Joined in {formatDate(channelData.createdAt)}</div>
                  <Link to={"/edit_channel"}>
                    <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-2.5 py-2.5 me-2">Customize channel</button>
                  </Link>
                </div>
              </>
            ) : (
              <div>Loading user data...</div>  // Show a loading message if the channel data is still fetching
            )}
          </div>
          
          {/* Navigation tabs for the dashboard */}
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              <li className="me-2">
                <Link
                  to={""}  // Link to the "All Videos" page
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  <MdGridView className="w-4 h-4 me-2" />
                  All Videos
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={"upload_video"}  // Link to the "Upload Video" page
                  className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                >
                  <MdEqualizer className="w-4 h-4 me-2" />
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Render the child components based on the current route */}
          <Outlet />
          
          {/* Button to delete the channel */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleDeleteChannel}  // Trigger the delete function
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Delete Channel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
