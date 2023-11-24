import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import MainTemplate from "./mainTemplate";
import MainTopBar from "./mainTopBar";
import MainTopNavigationBar from "./mainTopNavigationBar";
import MainTopSearchBar from "./mainTopSearchBar";
import PostList from "../postsPage/postList";

//테스트용 데이터들
const postsData = [
  {
    title: '게시글 제목 1',
    galleryImages: [
      {
        original: 'url_to_image_1',
        originalAlt: '게시글 제목 1',
        thumbnail: 'url_to_image_1',
        thumbnailAlt: '게시글 제목 1',
      },
      // 추가적인 이미지들...
    ],
    content: '게시글 내용 1',
    rating: 5,
    location: '서울',
    comments: ['댓글 1-1', '댓글 1-2', '댓글 1-3'],
    date: '2023-11-24',
  },
  {
    title: '게시글 제목 2',
    galleryImages: [
      {
        original: 'url_to_image_2',
        originalAlt: '게시글 제목 2',
        thumbnail: 'url_to_image_2',
        thumbnailAlt: '게시글 제목 2',
      },
      // 추가적인 이미지들...
    ],
    content: '게시글 내용 2',
    rating: 4,
    location: '부산',
    comments: ['댓글 2-1', '댓글 2-2'],
    date: '2023-11-23',
  },
  // 추가적인 게시글들...
];

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
      <PostList posts={postsData} />
      <div>{data}</div>
      <div>{error}</div>
      <div>{data2}</div>
      <div>{error2}</div>
    </div>
  );
};

export default MainPage;
