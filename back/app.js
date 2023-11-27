const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const cors = require("cors");
const { sequelize } = require("./models");
const authRouter = require("./routes/auth");
const path = require("path");
const cookieParser = require("cookie-parser");

//익스프레스 객체 할당
const app = express();

//개발 편하게 하는용도
app.use(morgan("dev"));

//env파일 상수 접근 가능
dotenv.config();

//DB연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log(`데이터베이스 연결 성공`);
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cookieParser());

//프론트에서 보내는 정보 parsing해주게 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//모든 도메인에서 API사용 허용
app.use(cors());

app.use(express.static(path.join(__dirname, "../front/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/build", "index.html"));
});

//상품관련 라우터
app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.use("/comment", commentRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const message = err.message;
  res.status(err.status || 500);
  res.json({ message });
});

//8000번 포트에 서버 연결
app.listen(8000, () => {
  console.log("서버연결 됨.");
});
