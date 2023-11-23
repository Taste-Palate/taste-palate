import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import MainTemplate from "./mainTemplate";
import MainTopBar from "./mainTopBar";
import MainTopNavigationBar from "./mainTopNavigationBar";
import MainTopSearchBar from "./mainTopSearchBar";

const MainPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [data2, setData2] = useState(null);
  const [error2, setError2] = useState(null);
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

  return (
    <div>
      <MainTemplate>
        <MainTopBar>
          <MainTopSearchBar search={search} />
          <MainTopNavigationBar />
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
