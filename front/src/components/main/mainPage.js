import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import MainTemplate from "./mainTemplate";
import MainTopBar from "./mainTopBar";
import MainTopNavigationBar from "./mainTopNavigationBar";
import MainTopSearchBar from "./mainTopSearchBar";

const MainPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [data2, setData2] = useState(null);
  const [error2, setError2] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const search = useCallback((id) => {
    axios
      .get(`posts/getPostDetail/${id}`)
      .then((response) => {
        setData2(JSON.stringify(response.data));
      })
      .catch((error) => {
        setError2(JSON.stringify(error));
      });
  }, []);

  useEffect(() => {
    // Axios를 사용하여 API 요청을 보냅니다.
    axios
      .get("posts/getposts")
      .then((response) => {
        setData(JSON.stringify(response.data));
      })
      .catch((error) => {
        setError(JSON.stringify(error));
      });
  }, []);

  useEffect(() => {
    // 쿠키를 확인하여 로그인 상태를 설정합니다.
    const authorizationCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authorization="));

    if (authorizationCookie) {
      // 쿠키가 존재하면 토큰 디코딩 및 만료 여부 확인
      const token = authorizationCookie.split("=")[1];
      const decodedToken = jwtDecode.jwtDecode(token);

      // 토큰의 만료 시간과 현재 시간 비교
      if (decodedToken.exp * 1000 > Date.now()) {
        // 만료되지 않았으면 로그인 상태 유지
        setIsLoggedIn(true);
      } else {
        // 만료되었으면 로그인 상태 해제
        setIsLoggedIn(false);
      }
    } else {
      // 쿠키가 없으면 로그인 상태 해제
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <MainTemplate>
        <MainTopBar>
          <MainTopSearchBar search={search} />
          <MainTopNavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        </MainTopBar>
      </MainTemplate>
      <div>{data}</div>
      <div>{error}</div>
      <div>{data2}</div>
      <div>{error2}</div>
    </div>
  );
};

export default MainPage;
