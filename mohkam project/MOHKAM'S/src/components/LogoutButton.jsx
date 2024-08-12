import React from 'react';
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useSetRecoilState } from 'recoil';
import userAtom from '../atom/userAtom';
import Toast from '../hooks/useShowToast';
import { useState } from 'react';
const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom);
    const [error, setError] = useState(null); // State to hold error message

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                // Check if the response indicates an error
                throw new Error(data.error || "Failed to login"); // Throw an error with the error message
              }

            localStorage.removeItem("user-mohkam");
            setUser(null);
        } catch (error) {
            setError(error.message); // Set error state
        }
    };

    return (<>
            <Link to="/auth"><button className="flex items-center py-1 text-white" onClick={handleLogout}>
                    <FiLogOut size={19} className="mr-2" /></button>
            </Link>
        {error && <Toast message={error} type="error" />}
        </>
    );
};

export default LogoutButton;
