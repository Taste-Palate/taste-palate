import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 수정된 부분: jwt-decode로 수정
import MainTemplate from "./mainTemplate";
import MainTopBar from "./mainTopBar";
import MainTopNavigationBar from "./mainTopNavigationBar";
import PostList from "../postsPage/postList";
import { useCookies } from "react-cookie";

const MainPage = () => {
  const [cookies] = useCookies(["authorization"]);
  let userId = 0;
  useEffect(() => {
    // 쿠키에서 JWT 토큰을 가져옵니다.
    const token = cookies.authorization;

    if (token) {
      // JWT 토큰을 해석합니다.
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    }
  }, [cookies.authorization]);

  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //검색 실패시에는 어떻게 해야 하나
  const search = useCallback((id) => {
    axios
      .get(`posts/${id}`)
      .then((response) => {
        setData(
          response.data.post.map((data) => {
            //이미지 나열 함수 필요
            let galleryImages = [];
            if (data.imagePath) {
              galleryImages = data.imagePath.split(",").map((image) => {
                return {
                  original: image,
                  originalAlt: "이미지를 불러오는데 실패했습니다.",
                  thumbnail: image,
                  thumbnailAlt: "이미지를 불러오는데 실패했습니다.",
                };
              });
            }
            return {
              userId,
              id: data.id,
              author: data.author,
              title: data.title,
              galleryImages: galleryImages,
              content: data.content,
              rating: data.rating,
              location: data.location,
              comments: ["댓글 1-1", "댓글 1-2", "댓글 1-3"],
              date: data.createdAt,
            };
          })
        );
      })
      .catch((error) => {
        setData([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get("posts")
      .then((response) => {
        setData(
          response.data.post.map((data) => {
            //이미지 나열 함수 필요
            let galleryImages = [];
            if (data.imagePath) {
              galleryImages = data.imagePath.split(",").map((image) => {
                return {
                  original: image,
                  originalAlt: "이미지를 불러오는데 실패했습니다.",
                  thumbnail: image,
                  thumbnailAlt: "이미지를 불러오는데 실패했습니다.",
                };
              });
            }
            return {
              userId,
              id: data.id,
              author: data.author,
              title: data.title,
              galleryImages: galleryImages,
              content: data.content,
              rating: data.rating,
              location: data.location,
              comments: ["댓글 1-1", "댓글 1-2", "댓글 1-3"],
              date: data.createdAt,
            };
          })
        );
      })
      .catch((error) => {
        setData([]);
      });
  }, []);

  useEffect(() => {
    const authorizationCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authorization="));

    if (authorizationCookie) {
      const token = authorizationCookie.split("=")[1];
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 > Date.now()) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <MainTemplate>
        <MainTopBar>
          <MainTopNavigationBar
            search={search}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        </MainTopBar>
      </MainTemplate>
      <PostList posts={data} />
      {data.length === 0 && <div>일치하는 검색결과가 없습니다.</div>}
    </div>
  );
};

export default MainPage;
