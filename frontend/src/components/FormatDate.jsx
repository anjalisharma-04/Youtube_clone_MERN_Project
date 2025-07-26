// frontend/src/components/FormatDate.jsx
import React from 'react';

const FormatDate = ({ dateString }) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMilliseconds = now - date;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  if (diffInMonths > 0) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
};

export default FormatDate;
