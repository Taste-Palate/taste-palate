// PostDetail.js
import React from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import './post.scss';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostDetailPage = ({ title, galleryImages, content, rating, location, comments, date, id, setDetail, userId, author }) => {
  const navigate = useNavigate();
  
  const handlePostClick = () => {
    // 클릭하면 setDetail을 사용하여 해당 게시물의 id를 설정
    setDetail(0);
  };

  const handleDelete = async (id) => {
    axios.delete(`posts/${id}`)
    .then(() => {
      alert("게시글이 삭제되었습니다.")
      window.location.reload();
    })
    .catch(()=> {
      alert("게시글을 삭제하는데 실패했습니다.");
    })
  };
  
  const handleEdit = async (id) => {
    navigate('/posts', {state : {title, galleryImages, content, rating, location, comments, id}})
  };

  return (
    <div className="post-detail-container">
      <div className="header">
      {author === userId && (
          <>
            <button onClick={() => handleDelete(id)}>삭제</button>
            <button onClick={() => handleEdit(id)}>수정</button>
          </>
        )}
        <h2>{title}</h2>
        <p>{date}</p>
      </div>
      {galleryImages && galleryImages.length > 0 && (
        <ImageGallery
          items={galleryImages}
          showPlayButton={false}
          showFullscreenButton={false}
          showNav={false}
          showThumbnails={true}
          renderItem={(item) => (
            <div className="image-item" width="600px" height="400px">
              <img
                src={item.original}
                alt={item.originalAlt}
                className="gallery-image"
                style={{
                  width: "600px",
                  height: "400px",
                  objectFit: "cover",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </div>
          )}
        />
      )}
      <div onClick={handlePostClick}>
      <p><strong>Content:</strong> {content}</p>
      <p><strong>Rating:</strong> {rating}</p>
      <p><strong>Location:</strong> {location}</p>
      <div className="comments">
        <strong>Comments:</strong>
        {comments.slice(0, 10).map((comment, index) => (
          <p key={index}>{comment}</p>
        ))}
      </div>
      </div>
    </div>
  );
};

export default PostDetailPage;