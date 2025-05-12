import React, { Children, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton
} from "@material-tailwind/react";
import About from "../../Pages/AboutPage/components/About";
import Footer from "../../components/Footer";

function AboutPage() {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const handleLoginNavigate = () => navigate("/login");
  const handleSignupNavigate = () => navigate("/signup");

  const handlePricingNavigate = () => {
    if (!token) {
      console.log("Please login first!");
      navigate("/login");
    } else {
      navigate("/pricing");
    }
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col dark:text-white text-secondary lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-7">
         <Typography as="li" variant="small">
        <a href="/" className="flex font-poppinsRegular dark:text-gray-400 items-center">Home</a>
      </Typography>
      <Typography as="li" variant="small">
        <a href="/aboutus" className="flex font-poppinsRegular dark:text-gray-400 items-center">About</a>
      </Typography>
      <Typography as="li" variant="small">
        <a href="/help" className="flex font-poppinsRegular dark:text-gray-400 items-center">Help</a>
      </Typography>
    </ul>
  );

  return (
    <div className="w-full min-h-screen text-white">
      {/* Navbar */}
      <div className="shadow-md border-none w-full mt-[.1vw] overflow-hidden">
        <Navbar className="fixed top-0 z-50 border-none dark:bg-secondary h-max max-w-full rounded-none px-24">
          <div className="flex items-center justify-between text-blue-gray-900">
            <Typography as="a" href="/" className="mr-4 cursor-pointer py-1.5 text-lg font-bold text-black">
              <div className="flex justify-center items-center">
                <h1 className="tracking-widest font-opensans font-semibold text-2xl dark:text-white">
                  REC<span className="dark:text-[#3730A3]">✦</span>VA
                </h1>
              </div>
            </Typography>
            <div className="flex items-center">
              <div className="hidden pr-[25vw] text-black lg:flex">{navList}</div>
              <div className="flex items-center gap-4">
                <Button
                  variant="text"
                  size="sm"
                  className="hidden font-poppinsRegular tracking-wider lg:inline-block rounded-[5px] p-[6px] px-4"
                  onClick={handleLoginNavigate}
                >
                  Log In
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  className="hidden bg-primary font-poppinsRegular tracking-wider hover:bg-indigo-800 rounded-lg p-2 px-4 lg:inline-block"
                  onClick={handleSignupNavigate}
                >
                  <span className="text-white">Sign in</span>
                </Button>
              </div>
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 pb-6 text-black lg:hidden"
                onClick={() => setOpenNav(!openNav)}
              >
                {openNav ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </IconButton>
            </div>
          </div>
          <MobileNav open={openNav}>
            {navList}
            <div className="flex items-center gap-x-1">
              <Button fullWidth variant="text" size="sm" onClick={handleLoginNavigate}>Log In</Button>
              <Button fullWidth variant="gradient" size="sm" onClick={handleSignupNavigate}>Sign In</Button>
            </div>
          </MobileNav>
        </Navbar>
      </div>

      {/* About Page Content */}
      <main className="pt-20 px-6">
        <div>
            <About/>
        </div>
      </main>

      <div>
      <Footer/>
      </div>
    </div>


  );
}

export default AboutPage;
