import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import Sidebar  from '../../../components/Sidebar';
import { IoArrowUpOutline } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import { useNavigate } from "react-router-dom";



function ProfileContent() {
  const navigate = useNavigate()


  const nexttab = () => {
    window.location.href = 'http://localhost:5174';
  }

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
   navigate("/ai", { state: { initialMessage: userInput } });

    
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // simulate loading
  };
  return (
    <div className='w-full mt-12 fixed top-0 left-0  overflow-y-auto   gradientblue h-screen '>
 
     
       
         <div className= ' relative dark:bg-[#15213f] overflow-x-hidden  w-full h-screen'>
        <Sidebar/>
          <div className='w-full h-[25%] '> <h1 className='text-gray-700 absolute left-72 top-14  text-3xl  font-poppinsMedium tracking-wider dark:text-white  '> Welcome!</h1></div>
          <div className='w-full h-[75%] bg-white dark:bg-secondary  '>
             <div className='w-full    border-white  h-20  z-40 flex '>

              <h1 className='absolute left-72  top-48 rounded-b-lg  w-[75%]  h-[8%] top-42 text-[17px] dark:text-white font-poppinsLight'>What can i help with? <span className="inline-block animate-spin-delay ml-2 text-primary dark:text-[#F1E5F7]">✦</span> </h1>
              <button onClick={nexttab} className='w-80 absolute dark:bg-primary  left-[30rem] sm:left-[35rem] md:left-[41rem] lg:left-[61.7rem] xl:left-[100rem]"  top-[170px] mt-5 h-12 rounded-md flex items-center justify-center bg-[#F1E3F6] hover:bg-[#e1c0ec] dark:hover:bg-indigo-800   focus-visible:outline-2 focus-visible:outline-offset-2  transition-all duration-300 ease-in-out"'>
                    <CiSearch className='text-gray-700 w-10 dark:text-white text-2xl' />
                    <p className='text-[12px] tracking-wider  font-poppinsRegular dark:text-white flex items-center justify-center mr-3   text-gray-700'>Launch Fraud Detection Dashboard</p>
                  </button>


              <div className='w-[74.6%] left-72 dark:bg-secondary  h-auto rounded-lg border-gray-200 hover:border-primary transition-all duration-[.2s] ease-in-out border-[1px] absolute top-72 '>
              <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about our website..."
          className='w-[920px] h-full dark:bg-secondary  rounded-lg p-4 focus:outline-none outline-none text-wrap overflow-y-auto font-poppinsRegular  hover:border-primary transition-all duration-[.3s] ease-in-out '
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          required
        />
        <button type="submit" className='absolute right-7 p-2 top-3 rounded-[50%] dark:hover:bg-gray-400 transition-all duration-[.2s] ease-in-out hover:bg-[#F2F3FE] bg-[#F1E6F8] '>
          {loading ? <CiNoWaitingSign className='text-black text-lg' /> : <IoArrowUpOutline className='text-gray-700 text-lg dark:text-black ' />}
        </button>
      </form>

      
              </div>
           
                 

              </div> 
           
                
           

            
          </div>
          
         
    
         </div>
      </div>
   

    
  )
}

export default ProfileContent
