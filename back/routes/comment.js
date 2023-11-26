const express = require("express");
const { verify } = require("jsonwebtoken");
const { verifyToken } = require("../middlewares");
const router = express.Router();

const { Comment, Post } = require("../models");

router.post("/:postId/remark", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { remark } = req.body;

    //댓글 작성할 포스트
    const post = Post.findByPk(postId);

    const userNick = res.locals.user.nick;

    if (!post) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }

    if (!remark) {
      return res.status(404).json({ message: "게시글 내용을 작성해주세요" });
    }

    if (!userNick) {
      return res.status(404).json({ message: "userNotFound" });
    }

    await Comment.create({ remark, postId, nick: userNick });
    return res.status(201).json({ message: "댓글이 성공적으로 등록되었습니다" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다 관리자에게 문의 해주세요."
    });
  }
});

//필요한가?
router.get("/", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const { commentId, remark } = req.body;

    const comment = Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ message: "수정할 댓글이 존재하지 않습니다." });
    }

    if (!remark) {
      return res.status(404).json({ message: "게시글 내용을 작성해주세요" });
    }

    comment.remark = remark;

    await comment.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다 관리자에게 문의 해주세요."
    });
  }
});

router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = Comment.findOne({ where: { id: commentId } });
    await comment.destroy();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다 관리자에게 문의 해주세요."
    });
  }
});

module.exports = router;
