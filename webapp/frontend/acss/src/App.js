import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';

import {AuthChecker} from "./helpers/AuthChecker";

function App() {

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken"))
        {
          setAuth(true);      
        }
      }, []);
  return (
    <>
    <AuthChecker.Provider value= {{auth, setAuth}} >
      <Router>
        <div className="container">
          <Header/>
          <Routes>
            <Route path ='/' element={<Dashboard/>} />
            <Route path ='/signup' element={<Signup/>} />
            <Route path ='/login' element={<Login/>} />

          </Routes>
        </div>
      </Router>
      </AuthChecker.Provider>
    </>
  );
}

export default App;
