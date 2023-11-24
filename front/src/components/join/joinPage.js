import React, { useState } from "react";
import "./joinPage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post("/auth/join", {
        email: email,
        password: password,
        passwordCheck: confirmPassword,
        nick: nickname,
      });
      alert("회원가입에 성공하였습니다.");
      navigate("/auth/login"); // 로그인 페이지로 이동
    } catch (error) {
      // 회원가입 실패 시
      setData(error.response.data.message);
    }
  };

  return (
    <form className="SignUpForm" onSubmit={onSubmit}>
      <ul>
        <li>
          <label>
            닉네임:
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
        </li>
        <li>
          <label>
            이메일:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </li>
        <li>
          <label>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </li>
        <li>
          <label>
            비밀번호 확인:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </li>
      </ul>
      <button type="submit">회원가입</button>
      <div>{data}</div>
    </form>
  );
};

export default JoinPage;
