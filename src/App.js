import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardWrite from "./pages/BoardWrite";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from './component/Navbar';
import { useEffect, useState } from 'react';
import api from './api/axiosConfig';

function App() {

  const[user,setUser] = useState(null); // 현재 로그인한 유저의 이름

  const checkUser = async() => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.username);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
  },[]);

  const handleLogout = async () => {
    await api.get("/api/auth/logout");
    setUser(null);
  }

  return (
    <div className='App'>
      <Navbar onLogout={handleLogout} user={user}/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login onLogin={setUser}/>}></Route>
        <Route path='/board' element={<Board user={user}/>}></Route>
        <Route path='/board/write' element={<BoardWrite />}></Route>
        <Route path='/board/:id' element={<BoardDetail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
