import React from 'react';

const Modal = ({ handleClose, show, postDetails }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button onClick={handleClose} className="close-button">
          X
        </button>
        {postDetails && (
          <>
            <h2>{postDetails.title}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{postDetails.date}</p>
            </div>
            {postDetails.galleryImages && postDetails.galleryImages.length > 0 && (
              {/* ImageGallery 등 이미지 표시 로직 추가 */}
            )}
            <p><strong>Content:</strong> {postDetails.content}</p>
            <p><strong>Rating:</strong> {postDetails.rating}</p>
            <p><strong>Location:</strong> {postDetails.location}</p>
            <p><strong>Comments:</strong> {postDetails.comments.slice(0).join(', ')}</p>
          </>
        )}
      </section>
    </div>
  );
};

export default Modal;