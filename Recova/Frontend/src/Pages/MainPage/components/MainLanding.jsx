import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import UserProfile from "./UserProfile";
import ProfileContent from "./ProfileContent";

import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";
import NavbarComp from "../../../components/NavbarComp";

function MainLanding() {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);

  const token = localStorage.getItem("token");

  const handlenavigation = () => {
    if(!token){
      console.log("please login first!")

      navigate("/login");
    }
  }
  const handlenavigation2 = () => {
    if(!token){
      console.log("please login first!")

      navigate("/profile");
    }
  }

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  

   const navList = (
       <ul className="mt-2 nav ml-56 mb-4 flex  flex-col gap-2  text-secondary lg:mb-0 lg:mt-0 lg:flex-row lg:items-center  lg:gap-7">
         <Typography
           as="li"
           variant="small"
           color="blue-gray"
           className=""
         >
           <a href="#" className="flex font-poppinsRegular dark:text-gray-400  items-center" onClick={handlenavigation2}>
             About
           </a>
         </Typography>
         <Typography
           as="li"
           variant="small"
           color="blue-gray"
           className="p-1 "
         >
           <a href="#" className="flex font-poppinsRegular dark:text-gray-400  items-center">
             Account
           </a>
         </Typography>
         <Typography
           as="li"
           variant="small"
           color="blue-gray"
           className="p-1 font-normal"
         >
           <a href="/pricing" className="flex font-poppinsRegular dark:text-gray-400 items-center" onClick={handlenavigation}>
             Pricing
           </a>
         </Typography>
         <Typography
           as="li"
           variant="small"
           color="blue-gray"
           className="p-1 "
         >
           <a href="/help" className="flex font-poppinsRegular dark:text-gray-400   items-center">
             Help
           </a>
         </Typography>
       </ul>
     );

  return (
    <div>
      <NavbarComp  >
        <div className=" shadow-md dark:[#121212]  w-full mt-[.1vw] overflow-hidden ">
          <Navbar className="fixed top-0 z-50 border-none bg-white dark:bg-[#212121] h-max max-w-full  rounded-none px-5 py-1 lg:px-10 ">
            <div className="flex items-center justify-between dark:[#121212] text-blue-gray-900 w-full">
                <Typography
                                 as="a"
                                 href="#"
                                 className="mr-4 cursor-pointer py-1.5 text-lg font-bold  text-black"
                               >
                                 <div className='flex justify-center items-center'>
                                {/* <img src={logo} alt="" className='w-12' /> */}
                                 {/* <img src={image} alt="" className='w-15 '/> */} 
                                 <h1 className='tracking-widest font-opensans font-semibold dark:text-white  text-2xl'>REC<span className='text-[#3730A3]'>✦</span>VA</h1>
                                 
                                 </div>
                               </Typography>

              <div className="hidden pr-[25vw] dark:text-white  text-black lg:flex">{navList}</div>

              {/* Right Side - User Profile */}
              <div className="flex items-center  text-black gap-4">
                <UserProfile /> {/* Avatar/Profile Component */}
                <IconButton
                  variant="text"
                  className="ml-auto mr-4 h-6 w-6 pb-6 text-inherit text-black hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
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
          </Navbar>
        </div>
      </NavbarComp>


      <div className="w-full ">
       <ProfileContent/>
       </div>
    </div>
  );
}

export default MainLanding;
