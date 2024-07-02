import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const checkLoggedIn = () => {
    const session_key = localStorage.getItem('token');
    // console.log("session_key",session_key);
    if (session_key === null) {
      setLoggedIn(false);
    }
    else{
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
        // Check if the specific key combination is pressed
        // console.log("pressed", event);
        if (event.ctrlKey && event.keyCode === 72) { // Show Modal
          console.log("changed from " + isVisible);
          event.preventDefault();
            setIsVisible(prev => !prev); // Toggle isVisible
        }
    };

    // Add event listener for keydown event
    window.addEventListener('keydown', handleKeyDown);
    checkLoggedIn();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoggedIn, isVisible]);

  if (isLoggedIn){
    return <Dashboard isVisible={isVisible} checkLoggedIn={checkLoggedIn}/>
  }
  return (
      <div className="App">
        <Login checkLoggedIn={checkLoggedIn}/>
      </div>
  );
}

export default App;
