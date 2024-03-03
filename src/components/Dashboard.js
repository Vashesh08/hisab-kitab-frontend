import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
// import SideNav from './SideNav.js';
// import Sidebar from './Sidebar.js';
import Navbar from './Navbar.js';

function Dashboard() {
  // const [userData, setUserData] = useState({});
  // const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        <Navbar />
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>

      </div>
    )
}

export default Dashboard;