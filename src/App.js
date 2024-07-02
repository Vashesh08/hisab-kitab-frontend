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

    if (session_key !== null) {
      setLoggedIn(true);
    }
    else{
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
        // Check if the specific key combination is pressed
        if ((event.ctrlKey && event.key === 'h') || (event.ctrlKey && event.key === 'H')) { // Show Modal
            event.preventDefault();
            setIsVisible(prev => !prev); // Toggle isVisible
        }
    };

    // Add event listener for keydown event
    window.addEventListener('keydown', handleKeyDown);
    checkLoggedIn();
  }, [isLoggedIn]);

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
