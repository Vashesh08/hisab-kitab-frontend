import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import "./Login.css";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin =  async (e) => {
      console.log("Login Component Called");
      e.preventDefault();
            
      try {
        // const data = {
        //   username: 'username',
        //   password: 'Qwert@123',
        // };
        // Send a request to your backend to authenticate the user and get a token
        // const response = await axios.post('https://hisab-kitab-api-v2.onrender.com/users/login', {
        //   data
        // });
        const response = {
            "data": {
                "token": "your_access_token_here"
              },
            "status_code": 200
        }
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
      
      <div className="container">
      <div className="wrapper">
        <div className="title"><span>Login Form</span></div>
        
        <form onSubmit={handleLogin}>
          
        <div className="row">
            <i className="fas fa-user"></i>
            <input 
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          </div>
          <div className="row">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="row button">
            <input type="submit" value="Login"/>
          </div>
        </form>
      </div>
      </div>
    );
  };
  
export default Login;