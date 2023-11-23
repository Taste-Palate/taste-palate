const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const { SECRET_KEY } = process.env;

exports.verifyToken = async (req, res, next) => {
  const { authorization } = req.cookies.authorization;
  if (!authorization) {
    return res.status(404).json({ message: "로그인 후 사용이 가능합니다." });
  }

  const [authType, authToken] = authorization.split(" ");

  if (authType !== "Bearer" || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후 사용이 가능합니다."
    });
    return;
  }

  try {
    const authorization = jwt.verify(authToken, `${SECRET_KEY}`);

    if (!authorization) {
      return res.status(401).json({ message: "로그인 후 사용이 가능합니다." });
    }

    const findUser = await User.findOne({
      where: { email: authorization.email }
    });

    if (!findUser) {
      return res.status(401).json({ message: "로그인 후 사용이 가능합니다." });
    }

    res.locals.user = findUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "로그인 후 사용이 가능합니다." });
  }
};
