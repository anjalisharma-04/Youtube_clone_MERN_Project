import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu } from 'react-icons/fi';
import { RiVideoUploadLine } from 'react-icons/ri';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getUserData } from '../Redux/slice/authSlice';
import CreateChannel from './CreateChannel';
import { useToast } from '../hooks/use-toast';
import logo from '../assets/youtube-logo2.png';

const Navbar = ({ openChange, onSearch }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const { toast } = useToast();

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserData(user._id));
    }
  }, [user, dispatch]);

  const toggleSidebar = () => openChange();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const openChannelModal = () => setShowModal(true);

  const closeChannelModal = () => setShowModal(false);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const navigateToUpload = () => {
    navigate('/your_channel/upload_video', { state: { openModal: true } });
  };

  const handleLogout = () => {
    dispatch(logout());
    toast({ title: 'You have successfully logged out' });
  };

  return (
    <>
      <nav className="fixed z-30 w-full bg-white border-b border-gray-200">
        <div className="px-1 py-1 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                className="fixed mt-2 lg:top-2 left-5 z-40 flex items-center justify-center w-6 h-6 bg-white rounded-full hover:bg-gray-100"
              >
                <FiMenu className="w-6 h-6" />
              </button>

              <a href="/" className="flex mt-2 ml-14 md:mr-24">
                <img src={logo} alt="Logo" className="mr-2.5 h-5" />
              </a>

              <form className="hidden lg:block lg:pl-3.5" style={{ marginLeft: 300 }}>
                <label htmlFor="search-input" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-96">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="search-input"
                    value={query}
                    onChange={handleSearch}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="Search"
                    style={{ height: 34 }}
                  />
                </div>
              </form>
            </div>

            {isLoggedIn ? (
              <div className="relative ml-auto lg:ml-4">
                <div className="flex items-center space-x-3">
                  {user?.hasChannel && (
                    <button onClick={navigateToUpload} className="flex items-center">
                      <RiVideoUploadLine className="w-6 h-6 text-gray-700 mr-5" />
                    </button>
                  )}

                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300"
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                  >
                    <span className="sr-only">User Menu</span>
                    {user ? (
                      <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <span>Loading...</span>
                    )}
                  </button>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded shadow-lg">
                    {user && (
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-900">{user.name}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                    )}

                    <ul className="py-1">
                      {user?.hasChannel ? (
                        <li>
                          <Link
                            to="/your_channel"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        </li>
                      ) : (
                        <li>
                          <button
                            onClick={openChannelModal}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Create Channel
                          </button>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-blue-500 no-underline">
                <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded font-medium flex items-center gap-1">
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CreateChannel isOpen={showModal} onClose={closeChannelModal} />
    </>
  );
};

export default Navbar;
