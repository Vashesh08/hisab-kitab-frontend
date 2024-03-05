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
          {/* <Route exact path='/master-stock' element={<Dashboard route='master-stock' />}></Route>
          <Route exact path='/melting-book' element={<Dashboard route='melting-book' />}></Route>
          <Route exact path='/kareegar-book' element={<Dashboard route='kareegar-book' />}></Route>  */}
        </Routes>
      </Router>
      </div>
  );
}

export default App;
