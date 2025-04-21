import React from 'react'
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

function Success() {
    const { width, height } = useWindowSize();
  return (
    <div className='flex flex-col items-center justify-center h-screen text-black'>
        <Confetti width={width} height={height} numberOfPieces={1000} recycle={false} gravity={0.09} />
      <h1 className='text-4xl font-bold'>🎉 Payment Successful!</h1>
      <p className='ml-10 '>Thank you for your purchase.</p>
    </div>
  )
}

export default Success
