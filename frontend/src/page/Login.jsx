import React, { useState } from 'react';
import logo from "../assets/G3d.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/slice/authSlice.js';
import { useToast } from "../hooks/use-toast";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await dispatch(login(formData)).unwrap();
      toast({
        title: "You have successfully logged in!",
      });
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      toast({
        variant: "destructive",
        title: err?.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoader(false);
    }
  };

  return loader ? (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-lg font-semibold">Loading...</span>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen bg-slate-100">
      <Link to="/" className="flex items-center mb-8 text-2xl font-semibold">
        <img src={logo} className="mr-4 h-11" alt="Logo" />
      </Link>
      <div className="w-full max-w-xl p-6 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 sm:text-sm"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Your password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 sm:text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3 text-base font-medium text-white bg-gray-700 rounded-lg hover:bg-black"
          >
            Login
          </button>
          <div className="text-sm font-medium text-gray-500">
            Not registered?{" "}
            <Link to="/signup" className="text-blue-700 hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
