import { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../api/axiosConfig";

function Signup () {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errors,setErrors] = useState({});

    const navigate = useNavigate();

    const handleSignup = async(e) => {
        e.preventDefault(); // onSubmit이 실행될 때 페이지가 새로고침되는 것을 막기 위해 e.preventDefault()를 꼭 넣어야 합니다.
        //이걸 안 넣으면 axios 요청이 날아가기 전에 폼이 리셋되거나 새로고침되어 버릴 수 있어요.
        setErrors({});
        try {
            await api.post("/api/auth/signup",{username,password});
            alert("회원 가입 성공");
            navigate("/login");
        } catch (err) {
            if(err.response && err.response.status === 400) {
                setErrors(err.response.data);
            } else {
                console.error("회원가입실패 : ",err);
                alert("회원 가입 실패");
            }
        }
    }

    return (
        <div className="form-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}></input>

                {errors.username && <p style={{color:"red"}}>{errors.username}</p>}
                {errors.password && <p style={{color:"red"}}>{errors.password}</p>}
                {errors.iderror && <p style={{color:"red"}}>{errors.iderror}</p>}

                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Signup;