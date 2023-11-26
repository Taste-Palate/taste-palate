const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares");

const { join, login, logout, getMyProfile, editMyProfile, editMyPassword, verifyEmail } = require("../controllers/auth");
require("dotenv").config();

// "/auth"

//회원 가입
router.post("/join", join);

//로그인
router.post("/login", login);

//로그아웃
router.get("/logout", logout);

//내정보 조회
router.get("/myInfo", verifyToken, getMyProfile);

router.patch("/myInfo", verifyToken, editMyProfile)

router.patch("/myPassword", verifyToken,editMyPassword)

router.get("/verifyEmail",verifyEmail);

module.exports = router;
