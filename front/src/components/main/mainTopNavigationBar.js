import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MainTopNavigationBar = ({ isLoggedIn, setIsLoggedIn }) => {
  
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청을 보냅니다.
      await axios.get("/auth/logout");

      // 로그아웃 상태를 업데이트합니다.
      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }

  return (
    <div className="navigation">
      {isLoggedIn && <Link to="/posts"><input type="button" value={`게시글 작성`} /></Link>}
      {!isLoggedIn && <Link to="/auth/login"><input type="button" value={`로그인`} /></Link>}
      {isLoggedIn && <input type="button" value={`로그아웃`} onClick={logout} />}
    </div>
  );
};

export default MainTopNavigationBar;
