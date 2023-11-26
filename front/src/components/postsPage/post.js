import React from 'react';
import './post.scss';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Post = ({ title, galleryImages, content, rating, location, comments, date, id, setDetail }) => {
  const handlePostClick = () => {
    // 클릭하면 setDetail을 사용하여 해당 게시물의 id를 설정
    setDetail(id);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{title}</h2>
        <p>{date}</p>
      </div>
      {galleryImages && galleryImages.length > 0 && <ImageGallery
        items={galleryImages}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        showThumbnails={true}
        renderItem={(item) => (
          <div className="image-item" width="400px" height="300px">
            <img
              src={item.original}
              alt={item.originalAlt}
              className="gallery-image"
              style={{
                width: "400px",
                height: "300px",
                objectFit: "cover",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
            </div>
            )}/>}
      <div onClick={handlePostClick}>
        <p><strong>Content:</strong> {content}</p>
        <p><strong>Rating:</strong> {rating}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Comments:</strong> {comments.slice(0, 1).join(', ')}</p>
      </div>
    </div>
  );
};

export default Post;