import { useEffect, useState } from "react";
import "./Board.css"
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

    function Board({user}) {

        const [posts, setPosts] = useState([]);
        const [loading,setLoading] = useState(true);
        const [error,setError] = useState("");

        const[currentPage,setCurrentPage] = useState(0);
        const[totalPages,setTotalPages] = useState();
        const[totalItems,setTotalItems] = useState();

        // 게시판 모든 글 요청
        const loadPosts = async (page = 0) => {
            try {
                setLoading(true);
                const res = await api.get(`/api/board?page=${page}&size=10`); // 모든 게시글 가져오기
                setPosts(res.data.posts); // posts -> 전체 게시글
                setCurrentPage(res.data.currentPage); // 현재 페이지
                setTotalPages(res.data.totalPages); // 전체 페이지
                setTotalItems(res.data.totalItems); // 전체 글 수
            } catch (err) {
                console.error(err);
                setError("게시글을 불러오는데 실패했습니다.");
                setPosts([]); // 게시글 배열 다시 초기화
            } finally {
                setLoading(false);
            }
        }

        const handleWrite = () => {
            if(!user) {
            alert("로그인 후 작성 가능합니다");
            return;
            }
            navigate("/board/write")
        };

        useEffect(() => {
            loadPosts(currentPage);
        },[currentPage])

        // 페이지 번호 표시 함수
        const getPageNumbers = () => {
            const start = (Math.floor((currentPage)/10))*10;
            const end = Math.min(start+10, totalPages);
            const pages = [];
            for (let i = start; i < end; i++) {
                pages.push(i);
            }
            return pages;
        }

        // 날짜 포맷 함수
        const formatDate = (dateString) => {
            
            return dateString.substring(0,10);
        }

        const navigate = useNavigate();

        return (
            <div className="container">
                <h2>게시판</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{color:"red"}}>{error}</p>}
                <table className="board-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length > 0 ? (
                            posts
                            .slice()
                            .reverse() // 최신글이 위로 오게
                            .map((p,index) => (
                            <tr key={p.id}>
                                <td>{posts.length - index}</td>
                                <td className="click-title" onClick={() => navigate(`/board/${p.id}`)}>
                                    {p.title}
                                </td>
                                <td>{p.author.username}</td>
                                <td>{formatDate(p.createDate)}</td>
                            </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan="4">게시물이 없습니다</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>

                <div className="pagnation">
                    <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>&lt;&lt;</button>
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>&lt;</button>
                    
                    {getPageNumbers().map((num)=>(
                        <button className={num===currentPage ? "active" : ""} key={num} onClick={() => setCurrentPage(num)}>{num+1}</button>
                    ))}

                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === (totalPages-1) || totalPages === 0}>&gt;</button>
                    <button onClick={() => setCurrentPage(totalPages-1)} disabled={currentPage === totalPages-1}>&gt;&gt;</button>
                </div>

                <div className="write-button-container">
                    <button onClick={handleWrite} className="write-button">글쓰기</button>
                </div>

            </div>
        );
    }

    export default Board;