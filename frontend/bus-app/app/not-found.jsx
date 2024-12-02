/**
 * NotFound @component renders a 404 error page with a header, an "About Us" popup, and a link to navigate back home.
 * 
 * @returns {JSX.Element} The rendered NotFound component.
 * 
 * @description
 * The NotFound component displays a 404 error message when a page is not found. It includes a header with a button to toggle the "About Us" popup. The popup provides information about the UGAthens Bus Stops service. The component also adjusts its layout based on the window width to provide a responsive design.
 * 
 * @function
 * @name NotFound
 * 
 * @property {boolean} showAbout - State to control the visibility of the "About Us" popup.
 * @property {function} setShowAbout - Function to update the showAbout state.
 * @property {boolean} mobile - State to determine if the view is on a mobile device.
 * @property {function} setMobile - Function to update the mobile state.
 * 
 * @hook useEffect - Hook to add and clean up the window resize event listener.
 */
'use client'
import Link from "next/link";
import { default as React, useEffect, useState } from 'react';
import Button from './components/ui/Button';







export default function NotFound() {
  const toggleAboutPopup = () => setShowAbout(!showAbout);
  const [showAbout, setShowAbout] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setMobile(window.innerWidth < 599);

    // Call once to set initial state based on current window width

    updateMobile();
    window.addEventListener('resize', updateMobile);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', updateMobile);
  }, [mobile]);

  return (
    <div>
<header className="bg-red-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">UGAthens Bus Stops</h1>
        <div className="flex space-x-4 items-center">
          {/* <Link> */}
          <Button onClick={toggleAboutPopup} className="text-white">
            About Us
          </Button>
         
        </div>
      </header>
      {showAbout && (
        <div
          className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50`}
          onClick={toggleAboutPopup}
        >
          <div
            className={`bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg w-1/2`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:text-sm lg:text-md xl:text-lg">
              <h2 className=" font-bold mb-4">About Us</h2>
              <p className=" leading-relaxed">
                Welcome to UGAthens Bus Stops! Our mission is to provide the most accurate and up-to-date
                information about bus stops around the University of Georgia campus. Whether you're a student
                rushing to class, a staff member heading to work, or a visitor exploring our beautiful campus,
                we are here to make your commute as seamless as possible.
              </p>
              {!mobile ?

                <p className="leading-relaxed mt-4">Our team is dedicated to leveraging technology and user-friendly design to enhance your
                  transportation experience. With features like real-time updates, route planning, and live
                  tracking, we aim to be the ultimate companion for your campus travels. Thank you for choosing UGAthens Bus Stops. Together, let&apos;s move forward efficiently and effectively!</p>
                : ''
              }

              <Button onClick={toggleAboutPopup} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
  
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      
    <div className="mx-auto max-w-md text-center">
        <h1 className="inline-flex text-5xl animate-spin hover:animate-none">😾</h1>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Oops, we couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-muted-foreground">
        We&apos;re sorry, but the page you were looking for doesn&apos;t seem to exist. It&apos;s possible the page has been moved or
        deleted, or you may have followed an outdated link.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex mx-auto items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white text-black hover:animate-pulse"
          prefetch={false}
        >
          Take me back home
        </Link>
      </div>
    </div>
  </div>
  </div>
  )
}

