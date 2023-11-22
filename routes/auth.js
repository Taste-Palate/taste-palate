const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares");

const { join, login, getMyProfile } = require("../controllers/auth");
require("dotenv").config();

// "/auth"

//회원 가입
router.post("/join", join);

//로그인
router.post("/login", login);

//내정보 조회
router.get("/myInfo", verifyToken, getMyProfile);

module.exports = router;
