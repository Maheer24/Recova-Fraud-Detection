import React from 'react'
import image from '../../../assets/images.png'
import { CiSearch } from "react-icons/ci";


function ProfileContent() {


  const nexttab = () => {
    window.location.href = 'http://localhost:5174';
  }
  return (
    <div className='w-full mt-12 h-screen '>
        <div className='w-full h-[70%] flex '>
            <div className='w-[80%] ml-20 mt-5'> 
                <div className='w-full flex flex-col items-center justify-center leading-snug text-[4vw] tracking-tighter  h-[50%]'>
            
                    <h1 className=' font-cabin font-bold mt-44 gradient-text1' >Welcome to your Secure </h1>
                    <span className=' font-cabin font-bold gradient-text2   '>Transaction Dashboard</span>
                </div>
                <div className='w-full flex  flex-col items-center tracking-wider justify-start text-[14px] leading-snug  h-[50%]'>
                  <span className='mt-20'>Analyze suspicious activity, track transactions, and</span>
                 
                  <span className='mt-1'>protect your platform with real-time fraud insights.</span>


                  <button onClick={nexttab} className='w-80 mt-5 h-12 rounded-md flex items-center justify-center bg-primary  hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ease-in-out"'>
                    <CiSearch className='text-gray-100 w-10  text-2xl' />
                    <p className='text-[1vw] flex items-center justify-center mr-3 font-poppinsLight text-gray-100'>Launch Fraud Detection Dashboard</p>
                  </button>
            
                </div>

                
            </div>
            <div className='w-[50%] flex items-center justify-center object-cover ' ><img src={image} className='w-[120%] h-[100%] mt-36 mr-40 animate-float' alt="" /></div>
            
        </div>

        
        
      
    </div>
  )
}

export default ProfileContent
