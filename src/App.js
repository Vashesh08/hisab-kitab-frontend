import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';

function App() {
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
    checkLoggedIn();
  }, [isLoggedIn]);

  if (isLoggedIn){
    return <Dashboard checkLoggedIn={checkLoggedIn}/>
  }
  return (
      <div className="App">
        <Login checkLoggedIn={checkLoggedIn}/>
      </div>
  );
}

export default App;
