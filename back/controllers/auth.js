const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const { locales } = require("validator/lib/isIBAN");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
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
      return res.status(400).json({ message: "비밀번호와 비밀번호 확인이 다릅니다." });
    }

    const bcryptPassword = await bcrypt.hash(password, 4);
    const uuid = uuidv4();
    await User.create({ email, password: bcryptPassword, nick, uuid });

    const transporter = nodemailer.createTransport({
      service: "gmail", // 또는 직접 SMTP 설정을 제공할 수 있습니다.
      auth: {
        user: process.env.GMAILID,
        pass: process.env.AUTHKEY
      }
    });

    const verificationLink = `http://localhost:8000/auth/verifyEmail?number=${uuid}&id=${email}`;

    const mailOptions = {
      from: process.env.GMAILID,
      to: email,
      subject: "테스트 이메일",
      html: `<p>계정 이메일 인증을 하려면 다음 링크를 클릭하세요: <a href="${verificationLink}">이메일 인증 하기</a></p>`
    };

    // 이메일을 보냅니다.
    transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: "true",
      message: "회원가입이 완료되었습니다.",
      data: {
        email: email,
        nick: nick
      }
    });
  } catch (errMessage) {
    console.log(error);
  }
  return;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "모든 항목을 입력해 주세요." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "해당 이메일로 가입된 아이디가 없습니다." });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "이메일 인증이 되어 있지 않은 계정입니다." });
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
  } catch (errMessage) {
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
    res.status(200).json({ user: id, email, nick, selfIntroduction });
  } catch (error) {
    //실패시 추가
  }

  return;
};

exports.editMyProfile = async (req, res, next) => {
  const user = res.locals.user;
  const updatedData = {
    nick: req.body.nick,
    selfIntroduction: req.body.selfIntroduction
  };
  try {
    await user.update(updatedData);
    res.json({
      code: 200,
      message: "회원정보를 성공적으로 수정하였습니다."
    });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.editMyPassword = async (req, res, next) => {
  const user = res.locals.user;
  //먼저 현재 비밀번호 제대로 적었는지 확인하고
  const comparePassword = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!comparePassword) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  if (req.body.newPassword != req.body.newPasswordConfirm) {
    return res.status(400).json({ message: "새로운 비밀번호가 서로 일치하지 않습니다." });
  }
  const bcryptPassword = await bcrypt.hash(req.body.newPassword, 4);
  const updatedData = {
    password: bcryptPassword
  };
  try {
    await user.update(updatedData);
    res.json({
      code: 200,
      message: "회원정보를 성공적으로 수정하였습니다."
    });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    if (req.query.number && req.query.id) {
      const exUser = await User.findOne({ where: { email: req.query.id } });

      if (!exUser) {
        return res.json("존재하지 않는 사용자입니다.");
      }

      if (exUser.uuid !== req.query.number) {
        return res.json("유효하지 않은 인증입니다.");
      }

      // Update the isVerified field and save the changes to the database
      exUser.isVerified = true;
      await exUser.save();

      return res.json("이메일 인증이 성공적으로 완료되었습니다.");
    } else {
      return res.json("유효하지 않은 인증입니다.");
    }
  } catch (error) {
    console.error("이메일 인증 중 오류 발생:", error);
    return res.status(500).json("서버 오류");
  }
};
