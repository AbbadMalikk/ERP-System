// src/components/Home.jsx
import React from 'react';
import '../gradDynamic.css';  // Import your custom CSS

const Home = () => {
    return (
        <div className="box gradDynamic relative h-screen">
            {/* SVG Decoration */}
           
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute top-0 left-0 z-0">
                <path fill="#FFFFFF" fill-opacity="1" d="M0,256L80,240C160,224,320,192,480,149.3C640,107,800,53,960,37.3C1120,21,1280,43,1360,53.3L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>

            {/* Content */}
            <section className="bg-transparent py-16 relative z-1">
                <div className="container mx-auto px-4 text-left my-8 relative z-1">
                    <h1 className="text-4xl font-bold text-gray-800 transition duration-500 ease-in-out hover:text-indigo-600">
                        Welcome to MOHKAM'S
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Designer and Furnishers
                    </p>
                    <a href="#" className="mt-6 inline-block bg-indigo-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out hover:bg-indigo-500">
                        Shop Now
                    </a>
                </div>
            </section>

           
        </div>
    );
}

export default Home;
