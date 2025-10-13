import "./Navbar.css"

import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">FM 홈페이지</div>
            <div className="menu">
                <Link to="/">Home</Link>
                <Link to="/board">게시판</Link>
                <Link to="/login">로그인</Link>
                <Link to="/singup">회원가입</Link>
                <button className="logout-btn">로그아웃</button>
            </div>
        </nav>
    );
}

export default Navbar;