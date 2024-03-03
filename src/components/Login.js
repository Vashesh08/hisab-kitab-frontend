import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import "./test2.css";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin =  async (e) => {
      console.log("Login Component Called");
      e.preventDefault();
            
      try {
        // Send a request to your backend to authenticate the user and get a token
        const response = await axios.post('https://hisab-kitab-api-v2.onrender.com/users/login', {
          "username": username,
          "password": password,
        });
        console.log(response);

        if ('token' in response) {
            console.log("invalid login");
            navigate("/");
        }
  
        // Assuming your backend sends a token upon successful authentication
        const token = response.data.token;
  
        // Store the token in localStorage or a secure storage method
        localStorage.setItem('token', response.data.token);
        console.log("tok", token, localStorage.getItem('token'));
        
        // Redirect the user to the dashboard
        console.log("go to dashboard");
        navigate('/dashboard');
      } catch (error) {
        // Handle authentication failure
        console.log("SOme Error. Log In Again")
        navigate("/");
      }
    };
  
    // Check if the user is already logged in
    useEffect(() => {
      const checkLoggedIn = () => {
        const token = localStorage.getItem('token');
        console.log("token:", token);
  
        if (token !== null) {
          navigate('/dashboard');
        }
      };
  
      checkLoggedIn();
    });
  
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Username
              </label>
              <div className="mt-2">
              <input 
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              name="username"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
              <input
                type="password"
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p> */}
        </div>
      </div>
      
      // <div className="container-login100">
      //   <div className="wrap-login100">

      //     <form className='login100-form p-l-55 p-r-55 p-t-178' onSubmit={handleLogin}>
      //     <span class="login100-form-title">
			// 			Login
			// 		</span>

      //     <div class="wrap-input100 validate-input m-b-16" data-validate="Please enter username">
      //       <input 
      //         class="input100"
      //         name="username"
      //         type="text"
      //         value={username}
      //         placeholder="Username"
      //         onChange={(e) => setUsername(e.target.value)}
      //         required
      //         />
			// 			<span class="focus-input100"></span>
			// 		</div>

      //     <div class="wrap-input100" data-validate = "Please enter password">
      //     <input
      //           type="password"
      //           placeholder="Password" 
      //           value={password}
      //           onChange={(e) => setPassword(e.target.value)}
      //           required
      //         />
      //       <span class="focus-input100"></span>
			// 		</div>
          
			// 		<div class="text-right p-t-13 p-b-23">
			// 			<span class="txt1">
			// 				Forgot
			// 			</span>

			// 			<a href="#" class="txt2">
			// 				Username / Password?
			// 			</a>
			// 		</div>

			// 		<div class="container-login100-form-btn">
			// 			<button type="submit" class="login100-form-btn">
			// 				Sign in
			// 			</button>
			// 		</div>

			// 		{/* <div class="flex-col-c p-t-170 p-b-40">
			// 			<span class="txt1 p-b-9">
			// 				Don’t have an account?
			// 			</span>

			// 			<a href="#" class="txt3">
			// 				Sign up now
			// 			</a>
			// 		</div> */}


              
      //       {/* <div className="row button">
      //         <input type="submit" value="Login"/>
      //       </div> */}
      //     </form>
      //   </div>
      // </div>
    );
  };
  
export default Login;