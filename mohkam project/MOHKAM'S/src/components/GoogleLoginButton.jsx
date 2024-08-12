// src/components/GoogleLoginButton.jsx
import React from 'react';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { popUp } from '../firebase'; // Import the popUp function from firebase
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atom/userAtom';
const GoogleLoginButton = () => {

    const navigate = useNavigate(); // Get useNavigate hook for redirection
    const setUser = useSetRecoilState(userAtom);
    const handleGoogleLogin = async () => {
        try {
            // Call the popUp function instead of signInWithPopup directly
            await popUp();
            const user = JSON.parse(localStorage.getItem('user-mohkam'));
            setUser(user);
            navigate('/');
            // You can optionally handle saving user data to MongoDB here or in the popUp function itself
        } catch (error) {
            console.error('Error during Google login:', error);
        }
    };

    return (
        <button
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleGoogleLogin}
        >
            <FcGoogle className="w-5 h-5 mr-2 mt-0.5" /> Login with Google
        </button>
    );
};

export default GoogleLoginButton;
