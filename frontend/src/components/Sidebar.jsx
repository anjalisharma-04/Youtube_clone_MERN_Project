// frontend/src/components/Sidebar.jsx
import React from 'react';
import { MdHome, MdHistory, MdVideoLibrary } from 'react-icons/md';
import { AiOutlinePlaySquare } from 'react-icons/ai';
import { RiVideoLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { label: 'Home', icon: <MdHome />, path: '/' },
    { label: 'Shorts', icon: <AiOutlinePlaySquare />, path: '/shorts' },
    { label: 'Subscriptions', icon: <RiVideoLine />, path: '/subscriptions' },
    { label: 'History', icon: <MdHistory />, path: '/history' },
    { label: 'Library', icon: <MdVideoLibrary />, path: '/library' },
  ];

  return (
    <aside className="w-56 bg-white shadow-md h-screen p-4 fixed top-0 left-0">
      <div className="flex flex-col gap-4 mt-16">
        {menuItems.map((item, idx) => (
          <Link
            to={item.path}
            key={idx}
            className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
