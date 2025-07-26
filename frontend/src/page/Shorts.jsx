//frontend/src/page/Shorts.jsx
import React from 'react';
import { FiAlertTriangle } from "react-icons/fi";
function Shorts() {
  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <div className=' mb-7 text-3xl font-black text-gray-900'>Shorts</div>
        <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
        <FiAlertTriangle className="flex-shrink-0 size-4 mt-0.5" />
        </div>
        <div className="ms-4">
          <h3 className="text-sm font-semibold">
            Cannot access this page.
          </h3>
          <div className="mt-1 text-sm text-yellow-700">
           The page is currently under maintenance.
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}

export default Shorts;
