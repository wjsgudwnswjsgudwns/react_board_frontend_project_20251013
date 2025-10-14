    import { useEffect, useState } from "react";
    import "./Board.css"
    import api from "../api/axiosConfig";

    function Board({user}) {

        const [posts, setPosts] = useState([]);

        // 게시판 모든 글 요청
        const loadPosts = async () => {
            try {
                const res = await api.get("/api/board"); // 모든 게시글 가져오기
                setPosts(res.data); // posts -> 전체 게시글
            } catch (err) {
                console.error(err);
            }
        }

        useEffect(() => {
            loadPosts();
        },[])

        // 날짜 포맷 함수
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString;
        }

        return (
            <div className="container">
                <h2>게시판</h2>
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
                                <td>{p.title}</td>
                                <td>{p.author.username}</td>
                                <td>{p.createDate}</td>
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
                <div className="write-button-container">
                    <button className="write-button">글쓰기</button>
                </div>

            </div>
        );
    }

    export default Board;