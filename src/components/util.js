// import axios from 'axios';

export const fetchProtectedData = async (setUserData, setError, navigate) => {
  // const token = localStorage.getItem('token');

  try {
    // Make a GET request to the protected route
    // const response = await axios.get('', {
    //   headers: {
    //     // Include the authentication token in the headers
    //     Authorization: token,
    //   },
    // });
    const response = {
        "data": {
            "token": "your_access_token_here"
          },
        "status_code": 200
    }

    if (response.status_code !== 200) {
        console.log("Error Status code", response.status_code);
        navigate('/');
    }

    // Parse the JSON response
    // const data = response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    navigate("/");
  }
};
