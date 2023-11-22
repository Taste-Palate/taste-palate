const express = require("express");
const { getMyPosts, getPosts, getPostDetail, createPost, putPost, deletePost } = require("../controllers/post");
const { verifyToken } = require("../middlewares");
const { User, Post } = require("../models");

const router = express.Router();

//라우터 설정
// "/posts"

// 게시물 모두 조회
router.get("/getPosts", async (req, res) => {
  try {
    const product = await Post.findAll({
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ]
    });
    return res.json({
      success: true,
      message: "목록 조회 성공",
      product
    });
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "목록 조회 실패"
    });
  }
});

// 내 게시물 조회
// 게시물 모두 조회에서 + 로그인한 유저인지 검증하고, 그 유저가 등록한 게시물만 조회해주기
router.get("/getMyPosts", verifyToken, async (req, res) => {
  try {
    // 이것들로 유저 찾을거임
    const user = await User.findOne({
      where: { email: res.locals.user.email }
    });

    console.log(user);

    const product = await Post.findAll({
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ]
    });
    return res.json({
      success: true,
      message: "나의 목록 조회 성공",
      product
    });
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "나의 목록 조회 실패"
    });
  }
});

// 게시물 상세조회
router.get("/getPostDetail/:id", async (req, res) => {
  try {
    const product = await Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ]
    });
    return res.json({
      success: true,
      message: "상세 조회 성공",
      product
    });
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      message: "상세 조회 실패"
    });
  }
});

// 게시물 작성
router.post("/writePost", async (req, res) => {
  try {
    const { title, content, imagePath, rating, location } = req.body;
    if (!title || !content || !imagePath || !rating || !location) {
      // 공란이 있으면 작성 실패
      if (title) {
        alert("제목을 작성해주세요");
      }
      if (content) {
        alert("내용을 작성해주세요");
        return;
      }
      if (imagePath) {
        alert("이미지를 삽입해주세요");
        return;
      }
      if (rating) {
        alert("별점을 등록해주세요");
        return;
      }
      if (location) {
        alert("위치를 설정해주세요");
        return;
      }
    } else {
      return res.status(200).json({
        success: true,
        message: "게시글 추가 성공"
      });
    }
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(405).json({
      success: false,
      message: "공란이 없게 작성해주세요"
    });
  }
});

router.put("getPostDetail/:id", verifyToken, putPost, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    const { title, content, imagePath, rating, location } = req.body;

    if (!title || !content || !imagePath || !rating || !location) {
      return res.status(400).json({
        message: "공란이 없게 작성해주세요."
      });
    }
    if (!post) {
      return res.status(404).json({
        message: "게시글이 존재하지 않습니다."
      });
    }
    if (post.author !== res.locals.user.id) {
      return res.status(401).json({
        message: "게시글을 수정할 권한이 존재하지 않습니다."
      });
    }

    post.title = title;
    post.content = content;
    post.imagePath = imagePath;
    post.rating = rating;
    post.location = location;

    await post.save();
  } catch (error) {
    res.status(500).json({
      message: "오류가 발생했습니다."
    });
  }
});

router.delete("getPostDetail/:id", verifyToken, deletePost, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({
        message: "게시글이 존재하지 않습니다."
      });
    }
    if (post.author !== res.locals.user.id) {
      return res.status(401).json({
        message: "게시글을 삭제할 권한이 존재하지 않습니다."
      });
    }

    await post.destroy();
  } catch (error) {
    res.status(500).json({
      message: "오류가 발생했습니다."
    });
  }
});

module.exports = router;
