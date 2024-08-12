import React from 'react';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atom/authAtom';
import userAtom from '../atom/userAtom';
import Toast from '../hooks/useShowToast.jsx';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import GoogleLoginButton from './GoogleLoginButton';
import Footer from './Footer.jsx';

const Login = () => {

  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [error, setError] = useState(null); // State to hold error message
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate(); // Get useNavigate hook for redirection

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // Check if the response indicates an error
        throw new Error(data.error || "Failed to login"); // Throw an error with the error message
      }
  
      localStorage.setItem("user-mohkam", JSON.stringify(data));
      setUser(data);
      navigate("/"); // Redirect to a protected route after login
  
    } catch (error) {
      setError(error.message); // Set error state
    }
  };
  

  const switchToSignUp = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setAuthScreen("signup");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto w-1/3 rounded-full"
            src="../mohkambg.png"
            alt="Mohkam"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}> {/* Use onSubmit handler */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                  value={inputs.email}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  value={inputs.password}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
              <p className='text-center py-3'>Don't have an account? <Link to="/" onClick={switchToSignUp} className='text-blue-600'>Signup</Link></p>
              <GoogleLoginButton/>
            </div>
          </form>
        </div>
      </div>
      {error && <Toast message={error} type="error" />}
    <Footer/>
    </>
  )
}

export default Login;
