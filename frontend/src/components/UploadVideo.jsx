// frontend/src/components/Uploadvideo.jsx
import { useNavigate } from 'react-router-dom';  
import React, { useState, useEffect } from 'react';  
import { FiX } from 'react-icons/fi'; 
import { HiPlus } from 'react-icons/hi';  
import { useDispatch } from 'react-redux';  
import { publishVideo } from '../Redux/slice/videoSlice';  
import { useToast } from "../hooks/use-toast";  
import { useLocation } from "react-router-dom";  

function UploadVideo() {
    // States for form data and modal visibility.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");  
    const [description, setDescription] = useState("");  
    const [thumbnail, setThumbnail] = useState(null);  
    const [videoFile, setVideoFile] = useState(null);  
    const [tags, setTags] = useState("");  
    const [loader, setLoader] = useState(false);  
    const dispatch = useDispatch(); 
    const location = useLocation();  

    // useEffect hook to open modal if the state has `openModal` set to true in location.
    useEffect(() => {
        if (location.state?.openModal) {
            setIsModalOpen(true);
        }
    }, [location.state]);

    // Function to toggle modal visibility.
    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const navigate = useNavigate();  
    const { toast } = useToast();  

    // Handlers for file inputs to update respective states.
    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);  // Sets the selected thumbnail file.
    };

    const handleVideoFileChange = (e) => {
        setVideoFile(e.target.files[0]);  // Sets the selected video file.
    };

    // Handle form submission to upload the video.
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior.
        
        // Creating a FormData object to hold the form data (title, description, thumbnail, etc.).
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);
        formData.append('videoFile', videoFile);
        formData.append('tags', tags);

        try {
            setLoader(true);  // Set loader to true when the upload starts.
            await dispatch(publishVideo(formData)).unwrap();  // Dispatch the publishVideo action with the formData.
            toast({  // Show success toast after video is uploaded.
                title: "Successfully Video Uploaded",
            });
            setLoader(false);  // Turn off loader after the upload is done.
            navigate("/your_channel");  // Navigate to user's channel page after upload.
        } catch (error) {
            console.log("Video Upload error: ", error);  // Log the error.
            toast({  // Show error toast if something goes wrong.
                variant: "destructive",
                title: "Something went wrong!",
            });
            setLoader(false);  // Turn off loader after failure.
        }
    };

    return (
        loader ? (  // Show loader if the video is being uploaded.
            <div className="text-center my-44">
                <div className="p-4 text-center">
                    <div role="status">
                        <span>Your Video is Uploading...</span>
                    </div>
                </div>
            </div>
        ) : (  // Otherwise, render the modal and form to upload the video.
            <>
                <div className="text-center">
                    {/* Button to toggle modal visibility */}
                    <button
                        onClick={handleToggleModal}
                        type="button"
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 mt-4"
                    >
                        Create
                    </button>
                </div>

                {isModalOpen && (  // Show the modal if isModalOpen is true.
                    <div id="crud-modal" className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                        <div className="relative p-4 w-full max-w-xl max-h-full bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Share Your Video
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleToggleModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                >
                                    <FiX size={20} color="currentColor" />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* Form to upload video */}
                            <form onSubmit={handleSubmit} className="p-4 md:p-5">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    {/* Title Input */}
                                    <div className="col-span-2">
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}  // Update title state on change.
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder="Enter video title"
                                            required
                                        />
                                    </div>
                                    {/* Thumbnail File Input */}
                                    <div className="col-span-2">
                                        <label htmlFor="thumbnail" className="block mb-2 text-sm font-medium text-gray-900">Thumbnail</label>
                                        <input
                                            type="file"
                                            name="thumbnail"
                                            id="thumbnail"
                                            onChange={handleThumbnailChange}  // Update thumbnail state on change.
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    {/* Video File Input */}
                                    <div className="col-span-2">
                                        <label htmlFor="videoFile" className="block mb-2 text-sm font-medium text-gray-900">Video</label>
                                        <input
                                            type="file"
                                            name="videoFile"
                                            id="videoFile"
                                            onChange={handleVideoFileChange}  // Update videoFile state on change.
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    {/* Tags Input */}
                                    <div className="col-span-2">
                                        <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            id="tags"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}  // Update tags state on change.
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder="Comma-separated tags, e.g., tech, music"
                                            required
                                        />
                                    </div>
                                    {/* Description Textarea */}
                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                        <textarea
                                            id="description"
                                            rows="4"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}  // Update description state on change.
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter video description"
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="text-white inline-flex items-center bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    <HiPlus size={20} color="currentColor" className="mr-2" />
                                    Upload Video
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </>
        )
    );
}

export default UploadVideo;
