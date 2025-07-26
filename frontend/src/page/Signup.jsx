// frontend/src/page/Signup.jsx
import React, { useState } from 'react'; 
import logo from "../assets/G3d.jpg"; 
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux'; 
import { register } from '../Redux/slice/authSlice'; 
import { useToast } from "../hooks/use-toast"; 

function Signup() {
    // useState hooks for managing form data, loader state, success and error messages
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const { toast } = useToast(); 
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 

    // Function to handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault(); 

        try {
            setLoader(true); 
            await dispatch(register(formData)).unwrap(); 
            setSuccessMessage('Signup successful!'); 
            setFormData({ name: '', email: '', password: '' }); 
            setError(''); 
            setLoader(false); 
            toast({
                title: "SignUp Successfully", 
            });
            navigate("/login"); 
        } catch (err) {
            setError(err.message || 'An error occurred.'); 
            setSuccessMessage(''); 
            toast({
                variant: "destructive", 
                title: 'An error occurred.',
            });
        }
    };

    // Function to handle input changes and update the form data state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        loader ?  
        // Display loading message while the signup request is being processed
        <div className="text-center my-72">
            <div className="p-4 text-center">
                <div role="status">
                    <span>Loading...</span>
                </div>
            </div>
        </div>
        :
        // Main signup form UI
        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 bg-slate-100">
            {/* Logo and link to homepage */}
            <a href="/" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10">
                <img src={logo} className="mr-4 h-11" alt="Logo" />
            </a>
            {/* Signup form container */}
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-900">
                    Create a New Account
                </h2>
                {/* Form for user to enter their details */}
                <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
                    {/* Name input field */}
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder="Enter Name"
                            required
                        />
                    </div>
                    {/* Email input field */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                    {/* Password input field */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            required
                        />
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-black focus:ring-4 focus:ring-primary-300 sm:w-auto">
                        Create account
                    </button>
                    {/* Display error message if there's an error */}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {/* Display success message if signup was successful */}
                    {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
                    {/* Link to login page if user already has an account */}
                    <div className="text-sm font-medium text-gray-500">
                        Already have an account? <Link to="/login" className="text-blue-700 hover:underline">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
