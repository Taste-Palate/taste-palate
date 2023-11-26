const express = require("express");
const { getMyPosts, getPosts, getPostDetail, createPost, putPost, deletePost } = require("../controllers/post");
const { verifyToken } = require("../middlewares");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
require("dotenv").config();

// AWS S3 설정
const s3 = new aws.S3({
  accessKeyId: process.env.SACCESSKEY,
  secretAccessKey: process.env.SSECRETACCESSKEY,
  region: process.env.SREGION
});

// Multer 및 multer-s3 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SBUCKETNAME,
    key: function (req, file, cb) {
      const folderPath = "images/";
      const uniqueKey = Date.now().toString() + "-" + file.originalname;
      cb(null, folderPath + uniqueKey);
    }
  })
});

const router = express.Router();

//라우터 설정
// "/posts"

// 게시물 모두 조회
// http://localhost:8000/posts/getPosts
router.get("/", getPosts);

// 내 게시물 조회
// 게시물 모두 조회에서 + 로그인한 유저인지 검증하고, 그 유저가 등록한 게시물만 조회해주기
router.get("/MyPosts", verifyToken, getMyPosts);

// 게시물 상세조회
router.get("/:title", getPostDetail);

// 게시물 작성
router.post(
  "/",
  verifyToken,
  (req, res) => {
    try {
      // upload.array('images')를 통한 이미지 업로드
      upload.array("images")(req, res, (err) => {
        if (err) {
          console.error("Error during file upload:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // 파일 업로드 성공시 createPost 함수 호출
        createPost(req, res);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createPost
);

//게시물 수정
router.put("/:id", verifyToken, putPost);

//게시물 삭제
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
