import React from 'react'
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { IoIosArrowRoundBack } from "react-icons/io";

function Success() {
    const { width, height } = useWindowSize();
  return (
    <div className='flex relative flex-col items-center justify-center h-screen text-black'>
      <a href="/" className="  w-[3vw]">
      
                <IoIosArrowRoundBack className="  absolute top-10 left-10 text-[2.2vw] " />
              </a>
              <a href="/profile" className=" absolute right-10 top-12 font-poppinsMedium hover:text-blue-600  w-[10vw]">
      
                Go to Profile
              </a>

        <Confetti width={width} height={height} numberOfPieces={1000} recycle={false} gravity={0.09} />
      <h1 className='text-4xl  font-poppinsMedium'>🎉 Payment Successful!</h1>
      <p className='ml-10 font-poppinsLight '>Thank you for your purchase.</p>
    </div>
  )
}

export default Success
