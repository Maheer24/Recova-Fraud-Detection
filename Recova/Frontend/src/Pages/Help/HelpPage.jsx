import React from 'react'
import Help from './components/Help'
import { IoIosArrowRoundBack } from "react-icons/io";

function HelpPage() {
  return (
    <div className='dark:bg-secondary'>
        
                    <a href="/" className=" left-0  w-[3vw]">
                
                          <IoIosArrowRoundBack className=" dark:bg-secondary pt-2 dark:text-gray-300 text-[3vw] font-bold ml-8 " />
                        </a>
      
        <Help />
      
    </div>
  )
}

export default HelpPage
