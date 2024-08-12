import React, { useState, useEffect } from 'react';

const Toast = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  // Hide the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-0 bg-white right-0 mb-4 mr-4 bg-${type === 'error' ? 'red' : 'green'}-200 border-2 border-${type === 'error' ? 'red' : 'green'}-500 rounded-md shadow-md py-2 px-4 flex items-center justify-center`}>
      {type === 'error' ? (
        <svg className="h-4 w-4 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.293 2.293a1 1 0 011.414 0L10 8.586l6.293-6.293a1 1 0 111.414 1.414L11.414 10l6.293 6.293a1 1 0 01-1.414 1.414L10 11.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 10 2.293 3.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 9a1 1 0 011-1h2.586L5.707 5.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L8.586 10H6a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )}
      <p className="text-xs text-gray-800">{message}</p>
    </div>
  );
};

export default Toast;
