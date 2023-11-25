import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import MainTemplate from "./mainTemplate";
import MainTopBar from "./mainTopBar";
import MainTopNavigationBar from "./mainTopNavigationBar";
import PostList from "../postsPage/postList";

//
/*[{"id":1,"title":"1234","content":"1234","imagePath":"1234","rating":1234,"location":"1234","createdAt":"2023-11-23T12:34:56.000Z",
"updatedAt":"2023-11-23T12:34:56.000Z","author":1,"User":{"nick":"1111","email":"1@naver.com"}}]
*/

const MainPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const search = useCallback((id) => {
    axios
      .get(`posts/${id}`)
      .then((response) => {
        setData(response.data.post.map((data) => {
          //이미지 나열 함수 필요
          return{
            title: data.title,
            galleryImages: [
              {
                original: 'url_to_image_1',
                originalAlt: '게시글 제목 1',
                thumbnail: 'url_to_image_1',
                thumbnailAlt: '게시글 제목 1',
              },
              // 추가적인 이미지들...
            ],
            content: data.content,
            rating: data.rating,
            location: data.location,
            comments: ['댓글 1-1', '댓글 1-2', '댓글 1-3'],
            date: data.createdAt
          }
        }));
      })
      .catch((error) => {
        setError(JSON.stringify(error));
      });
  }, []);

  useEffect(() => {
    axios
      .get("posts")
      .then((response) => {
        setData(response.data.post.map((data) => {
          //이미지 나열 함수 필요
          return{
            title: data.title,
            galleryImages: [
              {
                original: 'url_to_image_1',
                originalAlt: '게시글 제목 1',
                thumbnail: 'url_to_image_1',
                thumbnailAlt: '게시글 제목 1',
              },
              // 추가적인 이미지들...
            ],
            content: data.content,
            rating: data.rating,
            location: data.location,
            comments: ['댓글 1-1', '댓글 1-2', '댓글 1-3'],
            date: data.createdAt
          }
        }));
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
          <MainTopNavigationBar search={search} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        </MainTopBar>
      </MainTemplate>
      <PostList posts={data} />
      {error && <div>오류가 발생했습니다.</div>}
      {!error && !data && <div>일치하는 검색결과가 없습니다.</div>}
    </div>
  );
};

export default MainPage;
