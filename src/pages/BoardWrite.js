import { useState } from "react";
import "./BoardWrite.css"
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function BoardWrite ({user}) {

    const[title,setTitle] = useState("");
    const[content,setContent] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // 페이지 새로고침 방지

        if(!user) {
            alert("로그인 후 작성 가능합니다");
            return;
        }
         try {
            await api.post("/api/board",{title,content});
            navigate("/board");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="write-container">
            <h2>글쓰기</h2>
            <form onSubmit={handleSubmit} className="write-form">
                <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                <div className="button-group">
                    <button type="submit">등록</button>
                    <button type="button" onClick={() => navigate("/board")}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default BoardWrite;