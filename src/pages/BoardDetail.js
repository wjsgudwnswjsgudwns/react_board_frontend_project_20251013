import "./BoardDetail.css"

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

function BoardDetail({user}) {

    const navigate = useNavigate();

    const [post, setPost] = useState(null); // 해당 글 id 요청한 글 객체
    const [loading,setLoading] =useState(true);
    const [error, setError] = useState("");
    const {id} = useParams();

    const loadPost = async() => { // 특정 글 요청
        try{
            setLoading(true);
            const res = await api.get(`/api/board/${id}`);
            setPost(res.data);
        } catch(err) {
            console.error(err);
            setError("존재하지 않는 게시글입니다.");
            // alert("존재하지 않는 게시글입니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPost();
    },[id]);

    if(loading) return <p>게시글 불러오는 중</p>
    if(error) return <p style={{color:"red"}}>{error}</p>
    if(!post) return <p style={{color:"red"}}>존재하지 않는 글입니다.</p>

    // 로그인 상태이면서 로그인한 유저와 작성자가 일치하면 참
    const isAuthor = user && user === post.author.username;

    return (

        <div className="detail-container">
            <h2>{post.title}</h2>
            <p className="author">작성자 : {post.author.username}</p>
            <div className="content">{post.content}</div>

            <div className="button-group">
                <button onClick={() => navigate("/board")}>목록</button>
                { isAuthor && (
                <>
                    {<button>수정</button>}
                    {<button>삭제</button>}
                </>
                )}
            </div>
        </div>
    );
}

export default BoardDetail;