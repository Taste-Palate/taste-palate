import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./loginPage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/login", {
        email: email,
        password: password,
      });

      alert("로그인에 성공했습니다.");
      navigate("/");
    } catch (error) {
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <form className="SignUpForm" onSubmit={onSubmit}>
      <ul>
        <li>
          <label>
            아이디:
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
      </ul>
      <button type="submit">로그인</button>
      <br />
      <Link to={"/auth/join"}>
        <button type="button">회원가입하기</button>
      </Link>
    </form>
  );
};

export default LoginPage;
