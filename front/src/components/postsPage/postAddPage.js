import React, { useState, useCallback, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useDropzone } from "react-dropzone";
import "./postAddPage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const { kakao } = window;

const PostAddPage = () => {
  const useloca = useLocation();
  const params = useloca.state;
  const [title, setTitle] = useState(params?.title || "");
  const [content, setContent] = useState(params?.content || "");
  const [rating, setRating] = useState(params?.rating || 4.0);
  const [location, setLocation] = useState(params?.location || "");
  const [galleryImages, setGalleryImages] = useState(
    params?.galleryImages || []
  );
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    // 이미지 확장자만 필터링
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    // 파일을 처리하여 galleryImages 상태 업데이트
    const newImages = imageFiles.map((file) => ({
      //file부분이 없지 않나? 내가 S3에서 가져오는 이미지의 file은 어디있는데?
      file,
      original: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      originalHeight: 300,
      originalWidth: 400,
    }));
    setGalleryImages((prevGalleryImages) => [
      ...prevGalleryImages,
      ...newImages,
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = (index) => {
    // 갤러리에서 이미지 삭제
    setGalleryImages((prevGalleryImages) =>
      prevGalleryImages.filter((img, i) => i !== index)
    );
  };

  const handleRatingChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 5) {
      setRating(value);
    }
  };

  const post = async (e) => {
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("rating", rating);
    formData.append("location", location);
    //폼데이터 추가로 모든 url을 넣는다.
    // 이후 이미지들이 올라간다.
    // 수정된 이미지들 중 기존에 있던 이미지들의 경로를 유지한다.

    // 이미지를 FormData에 추가
    galleryImages.forEach((image, index) => {
      formData.append(`images`, image.file);
    });
    if (params?.id) {
      await axios.delete(`posts/${params.id}`);
    }
    await axios
      .post("posts", formData, config)
      .then(() => {
        alert("포스팅 되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        alert(error);
        alert("포스팅에 실패하였습니다.");
      });
  };

  useEffect(() => {
    kakao.maps.load(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latlng = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          const options = {
            center: latlng,
            level: 3,
          };

          // 지도 초기화
          const map = new kakao.maps.Map(
            document.getElementById("map"),
            options
          );

          // 좌표를 주소로 변환하여 설정
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(
            latlng.getLng(),
            latlng.getLat(),
            (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                setLocation(result[0].address.address_name);
              }
            }
          );

          // 지도를 클릭했을 때 좌표 가져오기
          kakao.maps.event.addListener(map, "click", function (mouseEvent) {
            const clickedLatLng = mouseEvent.latLng;
            console.log("Clicked LatLng:", clickedLatLng);

            // 좌표를 주소로 변환하여 설정
            geocoder.coord2Address(
              clickedLatLng.getLng(),
              clickedLatLng.getLat(),
              (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                  setLocation(result[0].address.address_name);
                }
              }
            );

            // 중심 좌표 변경
            map.setCenter(clickedLatLng);
          });
        });
      }
    }, []);
  }, []);

  return (
    <form encType="multipart/form-data" onSubmit={post}>
      <div className="PostPage">
        <div>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="post-input"
          />
        </div>
        <div>
          <label>본문:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            className="post-textarea"
          />
        </div>
        <div>
          <label>별점:</label>
          <input
            type="number"
            value={rating}
            onChange={handleRatingChange}
            step="0.5"
            min="0"
            max="5"
            className="post-input"
          />
        </div>
        <div id="map" style={{ width: "500px", height: "500px" }}></div>
        <div>
          <label>장소:</label>
          <input type="text" value={location} readOnly className="post-input" />
          <div id="map" style={{ width: "500px", hegiht: "500px" }}></div>
        </div>
        <div id="kakao-map" className="kakao-map"></div>
        <div>
          <h3>미리 본 이미지</h3>
          <ImageGallery
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
                <button
                  type="button"
                  onClick={() =>
                    removeImage(galleryImages.findIndex((img) => img === item))
                  }
                  className="delete-button"
                >
                  삭제
                </button>
              </div>
            )}
          />
        </div>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} accept="image/*" />
          {isDragActive ? (
            <p>이미지를 놓아주세요!</p>
          ) : (
            <p>이미지를 끌어서 놓거나 클릭하여 업로드하세요.</p>
          )}
        </div>
        <button type="submit" className="post-button">
          포스팅하기
        </button>
      </div>
    </form>
  );
};

export default PostAddPage;
