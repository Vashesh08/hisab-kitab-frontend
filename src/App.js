// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {

  return (
      <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<Login />}></Route>
          <Route exact path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
      </Router>
      </div>
  );
}

export default App;
