import React, { useEffect, useState } from 'react'
import NavbarComp from './components/NavbarComp'
import Landing from './components/Landing'
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";
import image from '../../assets/RECOVA.png'
import logo from '../../assets/1.png'
import Footer from '../../components/Footer';
function HomePage() {
  const [openNav, setOpenNav] = useState(false);
 
  useEffect(() => {
      window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
      );
    }, []);
     
  
    const navigate = useNavigate();
    const handleLoginNavigate = () => {
      navigate("/login");
  
    }
    const token = localStorage.getItem("token");

    const handlenavigation = () => {
      if(!token){
        console.log("please login first!")
  
        navigate("/login");
      }
      else{
        navigate("/pricing");
      }
    }

     const handlenavigation2 = () => {
      if(!token){
        console.log("please login first!")
  
        navigate("/login");
      }
      else{
        navigate("/profile");
      }
    }

     const handlenavigation3 = () => {
      if(!token){
        console.log("please login first!")
  
        navigate("/login");
      }
      else{
        navigate("/pricing");
      }
    }
  


    const handleSignupNavigate = () => {
      navigate("/login");
  
    }
   
    const navList = (
      <ul className="mt-2 nav  mb-4 flex flex-col dark:text-white  text-secondary lg:mb-0 lg:mt-0 lg:flex-row lg:items-center  lg:gap-7">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className=""
        >
          <a href="/aboutus" className="flex font-poppinsRegular dark:text-gray-400 items-center">
            About
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 "
        >
          <a href="#" className="flex font-poppinsRegular dark:text-gray-400 items-center" onClick={handlenavigation2}>
            Account
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="" className="flex font-poppinsRegular dark:text-gray-400 items-center" onClick={handlenavigation}>
            Pricing
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 "
        >
          <a href="/help" className="flex font-poppinsRegular dark:text-gray-400  items-center">
            Help
          </a>
        </Typography>
      </ul>
    );
   
  return (
    <div className='w-full h-screen'>
     
      <NavbarComp>
          <div className=" shadow-md border-none w-full mt-[.1vw] overflow-hidden ">
              <Navbar className="fixed top-0 z-50 border-none dark:bg-secondary h-max max-w-full rounded-none px-10   lg:px-10 lg:py-">
                <div className="flex items-center justify-between text-blue-gray-900">
                  <Typography
                    as="a"
                    href="#"
                    className="mr-4 cursor-pointer py-1.5 text-lg font-bold text-black"
                  >
                    <div className='flex justify-center items-center'>
           
                    <h1 className='tracking-widest font-opensans font-semibold text-2xl dark:text-white'>REC<span className='dark:text-[#3730A3]'>✦</span>VA</h1>
                    
                    </div>
                  </Typography>
                  <div className="flex items-center">
        
                    <div className="hidden pr-[25vw]  text-black lg:flex">{navList}</div>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="text"
                        size="sm"
                         className="hidden  dark:text-gray-400  font-poppinsRegular tracking-widest lg:inline-block rounded-[5px] p-[6px] px-4 outline-none focus:outline-none hover:outline hover:outline-[1px] hover:outline-primary transition-all duration-200"


                        onClick={handleLoginNavigate}
                      >
                        <span>Log In</span>
                      </Button>
                      <Button
                        variant="gradient"
                        size="sm"
                        className="hidden bg-primary font-poppinsRegular tracking-wider hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ease-in-out rounded-lg p-2 px-4 lg:inline-block"
                        onClick={handleSignupNavigate}
                      >
                        <span className="text-white  "> Sign in</span>
                      </Button>
                    </div>
                    <IconButton
                      variant="text"
                      className="ml-auto h-6 w-6 pb-6 text-inherit text-black hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                      ripple={false}
                      onClick={() => setOpenNav(!openNav)}
                    >
                      {openNav ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      )}
                    </IconButton>
                  </div>
                </div>
                <MobileNav open={openNav}>
                  {navList}
                  <div className="flex items-center gap-x-1">
                    <Button fullWidth variant="text" size="sm" className="">
                      <span>Log In</span>
                    </Button>
                    <Button fullWidth variant="gradient" size="sm" className="">
                      <span>Sign in</span>
                    </Button>
                  </div>
                </MobileNav>
              </Navbar>
        
             
            
            </div>
      </NavbarComp>
            <Landing />
        
  

      <Footer/>
    </div>
  )
}

export default HomePage
