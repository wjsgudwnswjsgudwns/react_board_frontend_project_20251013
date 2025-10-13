import { useNavigate } from "react-router-dom";
import "./Login.css"
import { useState } from "react";
import api from "../api/axiosConfig";

function Login ({onLogin}) {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault(); // submit 눌렀을때 초기화 되는 것을 막음 -> 자세한 내용은 Signup.js
        try {
            await api.post("/api/auth/login", new URLSearchParams({username,password})) // SecurityConfig에 경로 지정해둠

            //로그인한 사용자 정보 가져오기
            const res = await api.get("/api/auth/me");
            onLogin(res.data.username); // App에서 전달된 onLogin 값으로 로그인한 유저의 username 전달

            alert("환영합니다.");
            navigate("/", {replace:true}); // 홈으로 이동
        } catch (err) {
            console.error(err);
            alert("잘못된 아이디 또는 비밀번호입니다.");
        }
    };

    return (
        <div className="form-container">
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}

export default Login;