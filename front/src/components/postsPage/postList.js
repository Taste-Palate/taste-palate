import Post from "./post";
import "./post.scss";
import { useState } from "react";
import PostDetailPage from "./postDetailPage";

const PostList = ({ posts }) => {
  const [detail, setDetail] = useState(0);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {posts &&
        !detail &&
        posts.map((post, index) => (
          <Post setDetail={setDetail} key={index} {...post} />
        ))}
      {posts &&
        detail !== 0 &&
        posts
          .filter((post) => post.id === detail)
          .map((filteredPost, index) => (
            <PostDetailPage
              setDetail={setDetail}
              key={index}
              {...filteredPost}
            />
          ))}
    </div>
  );
};

export default PostList;
