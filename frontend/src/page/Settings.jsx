// frontend/src/page/Settings.jsx
import React from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import img from "../assets/c_6.webp"; 
import { useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { deleteAccount } from '../Redux/slice/authSlice'; 
import { useToast } from "../hooks/use-toast"; 

function Settings() {

    const [loader, setLoader] = useState(false);
    const userdata = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Function to handle account deletion when the button is clicked
    const handleDeleteClick = async () => {
        const value = confirm("Are you sure ?"); 
        if (value) { // If the user confirms the deletion
            try {
                setLoader(true); // Set loader to true while processing deletion
                dispatch(deleteAccount(userdata._id)); // Dispatch action to delete the account with user id
                setLoader(false); // Hide loader after deletion
                toast({
                    title: "Your account is deleted !", // Show success toast message
                });
                navigate("/signup"); // Redirect the user to the signup page after deletion
            } catch (error) {
                console.log("account delete error :", error); // Log any errors
                toast({
                    variant: "destructive", // Show error toast message
                    title: error,
                });
            }
        }
    };

    return (
        loader ?  
        // Show loader UI while the deletion process is in progress
        <div className="text-center my-72">
            <div className="p-4 text-center">
                <div role="status">
                    <span>Loading...</span>
                </div>
            </div>
        </div>
        :
        // Main content of the settings page
        <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
            <div className="mb-4 col-span-full xl:mb-2">
                <div className='text-lg mb-8'>Settings</div>
                
                {/* Section with YouTube setup image and description */}
                <div className="mb-16 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row max-w-6xl">
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                            Set up YouTube exactly how you want it
                        </h5>
                    </div>
                    <img 
                        className="ms-auto object-cover rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" 
                        src={img} alt="YouTube setup example"
                    />
                </div>

                {/* Table containing links for editing or deleting the account */}
                <div className="relative overflow-x-auto sm:rounded-lg">
                    <table className="w-1/2 text-sm text-left rtl:text-right text-gray-500">
                        <tbody>
                            {/* Row for editing account */}
                            <tr className="bg-white">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    Edit Account
                                </th>
                                <td className="px-6 py-4">
                                    <Link to="/EditAccount" className="font-medium text-blue-600 hover:underline">Edit</Link>
                                </td>
                            </tr>

                            {/* Row for deleting account */}
                            <tr className="bg-white">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    Delete Account
                                </th>
                                <td className="px-6 py-4">
                                    {/* Button for deleting the account */}
                                    <button 
                                        onClick={handleDeleteClick}  
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Settings;
