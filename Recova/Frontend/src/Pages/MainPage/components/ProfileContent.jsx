import React, { useState } from 'react'
import image from '../../../assets/images.png'
import { CiSearch } from "react-icons/ci";
import Sidebar  from '../../../components/Sidebar';
import { IoArrowUpOutline } from "react-icons/io5";



function ProfileContent() {


  const nexttab = () => {
    window.location.href = 'http://localhost:5174';
  }

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);


  const [chatHistory, setChatHistory] = useState([]);
  const [loadingofinput, setLoadingofinput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add the new question to the chat history
    setChatHistory([...chatHistory, { question: userInput, answer: 'Fake AI Answer for now!' }]);
    
    // Clear the input
    setUserInput('');

    // Optionally show loading effect
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // simulate loading
  };
  return (
    <div className='w-full mt-12 fixed top-0 left-0   gradientblue h-screen '>
         {/* <div className='w-full h-[70%] flex '>
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
            
        </div>  */}
     
       
         <div className= ' relative  w-full h-screen'>
        <Sidebar/>
          <div className='w-full h-[25%] '> <h1 className='text-gray-700 text-3xl flex justify-center items-center absolute left-72 top-16 font-poppinsRegular tracking-wider '> Welcome!</h1></div>
          <div className='w-full h-[75%] bg-white overflow-y-auto '>
             <div className='w-full h-full flex '>

              <h1 className='absolute left-72 top-48 text-[17px] font-poppinsLight'>What can i help with? <span className="inline-block animate-spin-delay mt-2 text-primary">✦</span> </h1>
              <button onClick={nexttab} className='w-80 absolute  left-[30rem] sm:left-[35rem] md:left-[41rem] lg:left-[61.7rem] xl:left-[100rem]"  top-[170px] mt-5 h-12 rounded-md flex items-center justify-center bg-[#F1E3F6] hover:bg-[#e1c0ec]  focus-visible:outline-2 focus-visible:outline-offset-2  transition-all duration-300 ease-in-out"'>
                    <CiSearch className='text-gray-700 w-10  text-2xl' />
                    <p className='text-[12px] tracking-wider  font-poppinsRegular flex items-center justify-center mr-3  text-gray-700'>Launch Fraud Detection Dashboard</p>
                  </button>


                  <div className="w-[75%] pt-5  ml-72 flex flex-col overflow-y-auto bg-gray-100 rounded-md relative mt-48 px-5 space-y-16">
          {chatHistory.map((chat, index) => (
            <div key={index} className="flex flex-col absolute overflow-y-auto space-y-2 ">
              <div className="font-poppinsMedium text-gray-800">Q: {chat.question}</div>
              <div className="font-poppinsLight text-gray-600">A: {chat.answer}</div>
            </div>
          ))}
        </div>

              <div className='w-[74.6%] left-72 h-auto rounded-lg border-gray-200 hover:border-primary transition-all duration-[.3s] ease-in-out border-[1px] absolute top-64 '>
              <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about our website..."
          className='w-full h-full rounded-lg p-4 focus:outline-none outline-none text-wrap overflow-y-auto font-poppinsRegular  hover:border-primary transition-all duration-[.3s] ease-in-out '
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          required
        />
        <button type="submit" className='absolute right-7  p-2 top-3 rounded-[50%] hover:bg-[#F2F3FE] bg-[#F1E6F8] '>
          {loading ? 'Asking...' : <IoArrowUpOutline className='text-gray-700' />}
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
