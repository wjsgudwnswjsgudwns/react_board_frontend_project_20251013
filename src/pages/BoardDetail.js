import "./BoardDetail.css"

import { useEffect, useState } from "react";
import { replace, useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

function BoardDetail({user}) {

    const navigate = useNavigate();

    const [post, setPost] = useState(null); // 해당 글 id 요청한 글 객체
    const [loading,setLoading] =useState(true);
    const [error, setError] = useState("");
    const {id} = useParams();

    const[editing,setEditing] = useState(false); // 수정화면 출력 여부
    const[title,setTitle] = useState("");
    const[content,setContent] = useState("");

    //특정 글 보기
    const loadPost = async() => { // 특정 글 요청
        try{
            setLoading(true);
            const res = await api.get(`/api/board/${id}`);
            setPost(res.data);
            setTitle(res.data.title); // 원본 글의 제목을 수정화면에 표시하는 변수인 title 변수에 저장
            setContent(res.data.content); // 원본 글을 수정화면에 표시하는 변수인 content 변수에 저장
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

    //삭제
    const handleDelete = async() => {
        try{
            if(window.confirm("정말 삭제하시겠습니까?")) {
                await api.delete(`/api/board/${id}`);
                alert("삭제 되었습니다.")
                navigate("/board", {replace:true});
            }
        } catch (err) {
            console.error(err);
            if(err.response.state === 403) {
                alert("삭제 권한이 없습니다.");
            } else {
                alert("삭제 실패 했습니다.")
            }
        }
        
    };

    // 수정
    const handleUpdate = async() => {
        if(!window.confirm("정말 수정하시겠습니까?")) {
            return;
        }

        try {
            const res = await api.put(`/api/board/${id}`, {title, content});
            alert("수정 되었습니다.");
            setPost(res.data); // 새로 수정된 글로 post 변경
            setEditing(false);
        } catch(err) {
            console.error(err);
            if(err.response.state === 403) {
                alert("수정 권한이 없습니다.");
            } else {
                alert("수정 실패 했습니다.")
            }
        }
    }

    // 댓글 영역
    const[newComment, setNewComment] =useState(""); // 새 댓글 등록
    const[comments,setComments] = useState([]); // 기존 댓글
    const[editCommentContent,setEditCommentContent] = useState("");
    const[editCommentId,setEditCommentId] = useState(null);

    // const isCommentAuthor = user && user === comments.author.username;

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        
        return dateString.substring(0,10);
    }

    // 댓글 등록
    const handleCommentSubmit = () => {

    }

    // 댓글 삭제
    const handleCommentDelete = (commentId) => {

    }

    // 댓글 수정
    const handleCommentUpdate = () => {

    }

    // 댓글 영역

    if(loading) return <p>게시글 불러오는 중</p>
    if(error) return <p style={{color:"red"}}>{error}</p>
    if(!post) return <p style={{color:"red"}}>존재하지 않는 글입니다.</p>

    // 로그인 상태이면서 로그인한 유저와 작성자가 일치하면 참
    const isAuthor = user && user === post.author.username;

    return (

        <div className="detail-container">

            {editing ? (
                <div className="edit-form">
                    <h2>글 수정</h2>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                    <div className="button-group">
                        <button className="edit-button" onClick={handleUpdate}>저장</button>
                        <button className="delete-button" onClick={() => setEditing(false)}>취소</button>
                    </div>
                </div>                    
            ) : 
            
            (
                <>
                    <h2>{post.title}</h2>
                    <p className="author">작성자 : {post.author.username}</p>
                    <div className="content">{post.content}</div>

                    <div className="button-group">
                        <button onClick={() => navigate("/board")} className="list-button">목록</button>
                        { isAuthor && (
                        <>
                            {<button className="edit-button" onClick={() => setEditing(true)}>수정</button>}
                            {<button className="delete-button" onClick={handleDelete}>삭제</button>}
                        </>
                        )}
                    </div>

                    {/* 댓글 영역 시작 */}
                    <div className="comment-section">
                        {/* 댓글 입력 세션 */}
                        <h3>댓글</h3>
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea placeholder="댓글" value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                            <button type="submit" className="comment-button">등록</button>
                        </form>

                        {/* 댓글 리스트 세션 */}
                        <ul className="comment-list">
                            {comments.map((c)=>(
                                <li key={c.id} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-author">
                                            {c.author.username}
                                        </span>
                                        <span className="comment-date">
                                            {formatDate(c.createDate)}
                                        </span>
                                    </div>
                                    
                                    <div className="comment-content">
                                        {c.content}
                                    </div>

                                    <div className="button-group">
                                        <button onClick={() => navigate("/board")} className="list-button">목록</button>
                                        { user === c.author.username && (
                                        <>
                                            {<button className="edit-button" onClick={() => handleCommentSubmit(c)}>수정</button>}
                                            {<button className="delete-button" onClick={handleCommentDelete(c.id)}>삭제</button>}
                                        </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 댓글 영역 끝 */}

                </>
            )}

        </div>
    );
}

export default BoardDetail;