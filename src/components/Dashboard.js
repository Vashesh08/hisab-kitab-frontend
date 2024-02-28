import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
import React from 'react';

function Dashboard() {
  // const [userData, setUserData] = useState({});
  // const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      // Redirect the user to the login page
      navigate('/');
    };
    
    // useEffect(() => {
    //     const fetchProtectedData = async () => {
    //       const token = localStorage.getItem('token');
    //       try {
    //         // Make a GET request to the protected route
    //         // const response = await fetch('', {
    //         //   method: 'GET',
    //         //   headers: {
    //         //     // Include the authentication token in the headers
    //         //     Authorization: token,
    //         //   },
    //         // });
    //         const response = {
    //             "success": true,
    //             "message": "Authentication successful",
    //             "data": {
    //               "token": "your_access_token_here"
    //             },
    //             "status_code": 404,
    //             "ok": true
    //           }
    
    //         if (response.status_code !== 200) {
    //           console.log("Status Code ", response.status_code);
    //           navigate("/");
    //         }

    //         // Parse the JSON response
    //         const data = {
    //             "success": true,
    //             "message": "Authentication successful",
    //             "data": {
    //               "token": "your_access_token_here"
    //             },
    //             "status_code": 200,
    //             "ok": true,
    //             "userDetails": {"name": "Vashesh"},
    //           }
    //       } catch (error) {
    //         console.error('Some Error:', error.message);
    //         navigate("/");
    //       }
    //     };
    
    //     fetchProtectedData();
    //   }, []); // Make the request only once when the component mounts
    useEffect(() =>{
        const checkLoggedIn = () => {
        const token = localStorage.getItem('token');
        // send request to check authenticated
        console.log(localStorage);
        console.log("dashboaord", token);
        if (token === null) {
          navigate('/');
        }
      };
      checkLoggedIn();
    }, [navigate]);

    return (
      <div> 
        Dashboard Page
        <button onClick={handleLogout}> Logout </button>
        {/* <Navbar /> */}
      </div>
    )
}

export default Dashboard;