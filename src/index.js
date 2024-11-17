import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { deleteUtilityList } from './api/utility';

const DisableAndRedirect = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');    
    deleteUtilityList(token);
  }, []);

  // Redirect after logging
  return <Navigate to="/secure" replace />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
        <Routes>
          <Route exact path='/secure' element={<App />}></Route>
          <Route exact path='/disableWhole' element={<DisableAndRedirect />}></Route>
          <Route exact path='/' element={<Loading />}></Route>
        </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
