// frontend/src/layouts/AuthLayout.jsx
import React from 'react';
import { useSelector } from 'react-redux';  
import { useNavigate } from 'react-router-dom';  

function AuthLayout({ children }) {
    // Getting the authentication status from Redux state.
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();  // Hook to navigate to different routes programmatically.

    // useEffect hook to redirect the user to the homepage if they are not authenticated.
    React.useEffect(() => {
        if (authStatus === false) {
            navigate("/");  // Redirect to homepage if user is not authenticated.
        }
    }, [authStatus, navigate]);  // The effect depends on authStatus and navigate.

    return (
        <>
            {/* If the user is authenticated (authStatus === true), render the children components (e.g., protected content). 
                Otherwise, nothing is rendered. */}
            {authStatus === true ? children : null}
        </>
    );
}

export default AuthLayout;
