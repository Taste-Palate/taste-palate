import Post from "./post";
import './post.scss';

const PostList = ({ posts }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  );
};

export default PostList