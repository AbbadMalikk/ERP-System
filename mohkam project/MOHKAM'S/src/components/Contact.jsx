import React from 'react'
import Footer from './Footer'
const Contact = () => {
  return (<>
    <div className="box gradDynamic relative h-screen">
      <section className=" py-8">
      <div className="ml-6 max-w-7xl  ">
        <h2 className="text-4xl font-bold text-gray-800 py-5 transition duration-500 ease-in-out hover:text-indigo-600 mb-4">About Us</h2>
        <p className="text-lg text-gray-600 w-1/2">
          At Mohkam's Designers & Furnishers, we pride ourselves on offering exquisite furniture that blends quality and elegance. Located in Lahore, we provide tailored solutions to enhance your living spaces.
        </p>
      </div>
      <ul className='ml-10 my-6 text-gray-600' style={{ listStyleType: 'circle' }}><li>
              <p>699-H3, Johar Town, Lahore, Pakistan br</p>
            </li>
              <li><p>Tel: +92 42 35316660-1</p></li>
              <li><p>Cell: +92 428139012</p></li>
              <li><p>mohkam.furniture@gmail.com</p></li>
              <li><p>Monday to Saturday: 9:00 AM to 6:00 PM</p></li>
            </ul>
    </section>
    </div>
    <Footer/>
</>
  )
}

export default Contact