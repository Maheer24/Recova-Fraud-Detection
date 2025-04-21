import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import png from '../../../assets/google.png'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
export default function SignUp()  {


    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, seterror] = useState('')
    const [showPassword, setShowPassword] = useState(false);
  
    const navigate = useNavigate()

    const handlePasswordVisibility = () => {
      setShowPassword(!showPassword);
    }

  
  
    const submitHandler = async (e) => {
      e.preventDefault();
     
       axios.post('/api/user/signup', {
        email: email,
        password: password
      }).then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate('/main')
      
        console.log(res.data)

  
  
        
  
      }).catch((err) => {
        console.log(err)
      
      if (err.response && err.response.data.message) {
          seterror(err.response.data.message); 
      } 
      if(password.length < 6){
        seterror("Password should be at least 6 characters long")

      }
    
     
  
      

      })


  
    }

    
  return (
    <>
     
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">

      {error && ( // Show error message if error exists
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Oops!</strong>
          <span className="block sm:inline"> {error} </span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => seterror("")}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      


      <a href="/" className=" w-[3vw]">
    
<IoIosArrowRoundBack className="text-[2vw] "/>
      </a>


        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking- text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={submitHandler}>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium  text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                 onChange={(e) => setemail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-gray-100 border-[1px] border-gray-200 px-3 py-1.5 text-base text-gray-900  outline-gray-200 placeholder:text-gray-400  sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
               
                
                
              </div>
           
             <div className="mt-2 relative  ">
                <input
                  onChange={(e) => setpassword(e.target.value)}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-gray-100 border-[1px] border-gray-200 px-3 py-1.5 text-base text-gray-900  outline-gray-200 placeholder:text-gray-400  sm:text-sm/6"
                />
                
                <div className={` pl-1 absolute top-2 right-0 mr-3  `} onClick={handlePasswordVisibility}>
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon className="text-gray-500 " />

                  ) : (
                    <VisibilityOutlinedIcon className="text-gray-500" />
                  )}
                </div>
                
                
              </div>
              
           
             
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center tracking-wider rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm/6 text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login here
            </a>
          </p >

          <p className="mt-8 text-center text-sm/6 text-gray-500"> Or continue with</p>
          <div className="mt-5 flex gap-2 justify-center items-center">
       <a  href="http://localhost:3000/auth/google">
       <button
                type="submit"
                className="flex w-full justify-center tracking-wider rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-500 shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              <img src={png} className="w-[1.3vw] mt-[.2vw] h-[1.3vw] mr-2" alt="" />
                Google
              </button>
       </a>
           
          </div>
        </div>
      </div>
    </>
  )
}

