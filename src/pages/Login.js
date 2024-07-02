import React, { useState } from 'react';
import axios from 'axios';
import config from '../config.js';
import Loading from '../components/Loading.js';

function Login(checkLoggedIn) {
  // console.log("Sessi", Login);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin =  async (e) => {
      // console.log("Login Component Called");
      e.preventDefault();

      try {
        setIsLoading(true);
        // Send a request to your backend to authenticate the user and get a token
        const response = await axios.post(`${config.API_URL}/users/login`, {
          "username": username,
          "password": password,
        });

        if ('token' in response.data) {
            console.log("valid login");
        

        // Assuming your backend sends a token upon successful authentication
        // const token = response.data.token;

        // Store the token in localStorage or a secure storage method
        localStorage.setItem('token', response.data.token);
        // console.log("tok", token, localStorage.getItem('token'));
        // Redirect the user to the dashboard
        // console.log("go to dashboard");
        // navigate('/dashboard');
        // console.log(checkLoggedIn)
        checkLoggedIn.checkLoggedIn();
      }
      } catch (error) {
        // Handle authentication failure-[]
        console.log("Some Error. Log In Again", error)
      }
      setIsLoading(false)
    };

    if (isLoading){
      return <Loading />
    }

    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="logo.png"
            alt="RK Jewellers"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In
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
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
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
        </div>
      </div>
    );
  };
  
export default Login;