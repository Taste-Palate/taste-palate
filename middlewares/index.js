const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const { SECRET_KEY } = process.env;

exports.verifyToken = async (req, res, next) => {
  const { authorization } = req.cookies;
  const [authType, authToken] = authorization.split(" ");

  if (authType !== "Bearer" || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후 사용이 가능한 API 입니다."
    });
    return;
  }

  try {
    const authorization = jwt.verify(authToken, `${SECRET_KEY}`);
    console.log(authorization);

    if (!authorization) {
      return res.status(401).json({ message: "로그인 필요" });
    }

    const findUser = await User.findOne({
      where: { email: authorization.email }
    });

    if (!findUser) {
      return res.status(401).json({ message: "로그인 해" });
    }

    res.locals.user = findUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "로그인 해줘" });
  }
};
