const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const { locales } = require("validator/lib/isIBAN");

require("dotenv").config();
const { SECRET_KEY } = process.env;

exports.join = async (req, res) => {
  try {
    const { email, password, passwordCheck, nick } = req.body;

    if (!email || !password || !passwordCheck || !nick) {
      return res.status(400).json({ message: "모든 항목을 입력해 주세요" });
    }

    //사용중인 이메일 검사
    const exsistsUser = await User.findOne({
      where: { email }
    });

    if (exsistsUser) {
      return res.status(405).json({
        message: "이미 사용중인 이메일 입니다."
      });
    }

    //이메일 체크 유효성 체크
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    function emailValiChk(email) {
      if (pattern.test(email) === false) {
        return res.status(400).json({ message: "이메일 형식이 맞지 않습니다." });
      }
    }
    emailValiChk(email);

    if (password != passwordCheck) {
      return res.status(400).json({ message: "비밀번호와 비밀번호 확인 다릅니다." });
    }

    const bcryptPassword = await bcrypt.hash(password, 4);
    await User.create({ email, password: bcryptPassword, nick });

    return res.status(201).json({
      success: "true",
      message: "회원가입이 완료되었습니다.",
      data: {
        email: email,
        nick: nick
      }
    });
  } catch (error) {
    console.log(error);
  }
  return;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "모든 항목을 입력 해 주세요." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "해당 이메일로 가입된 아이디가 없습니다." });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign({ id: user.id, email: user.email, nick: user.nick }, `${SECRET_KEY}`, {
      expiresIn: "1d"
    });

    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "성공적으로 로그인 되었습니다." });
  } catch (error) {
    console.log(error);
  }
};

//로그아웃

exports.logout = async (req, res) => {
  try {
    res.clearCookie("authorization");
    return res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    console.log(error);
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    //res.locals.user에 찾은 유저 있음.
    // selfIntroduction: ->이걸 넘겨줘야 함.
    // 
    const { id, email, nick, selfIntroduction } = res.locals.user;
    res.status(200).json({ user: id, email, nick, selfIntroduction});
  } catch (error) {
    //실패시 추가
  }

  return;
};

exports.editMyProfile = async (req, res, next) => {
  const user = res.locals.user;
  const updatedData = {
    nick: req.body.nick,
    selfIntroduction: req.body.selfIntroduction,
  }
  try {
    await user.update(updatedData);
    res.json({
      code:200,
      message: "회원정보를 성공적으로 수정하였습니다."
    })
    return
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.editMyPassword = async (req, res, next) => {
  const user = res.locals.user;
  //먼저 현재 비밀번호 제대로 적었는지 확인하고
  const comparePassword = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!comparePassword) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  if(req.body.newPassword != req.body.newPasswordConfirm){
    return res.status(400).json({ message: "새로운 비밀번호가 서로 일치하지 않습니다."})
  }
  const bcryptPassword = await bcrypt.hash(req.body.newPassword, 4)
  const updatedData = {
    password: bcryptPassword
  }
  try {
    await user.update(updatedData);
    res.json({
      code:200,
      message: "회원정보를 성공적으로 수정하였습니다."
    })
    return
  } catch (error) {
    console.error(error)
    next(error)
  }
}
