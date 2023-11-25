const express = require("express");
const { getMyPosts, getPosts, getPostDetail, createPost, putPost, deletePost } = require("../controllers/post");
const { verifyToken } = require("../middlewares");
const { User, Post } = require("../models");

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
router.post("/", verifyToken, createPost);

//게시물 수정
router.put("/:id",verifyToken, putPost );

//게시물 삭제
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
