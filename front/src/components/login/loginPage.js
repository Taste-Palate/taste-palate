import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './loginPage.scss';
import axios from 'axios';



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post("/auth/login", {
        email: email,
        password: password
      })
      .then((data) => setData(JSON.stringify(data)))
      .catch((error) => setData(JSON.stringify(error)));
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
      <button type="submit">
        로그인
      </button>
      <br/>
      <Link to={"/auth/join"}><button type="button">
          회원가입하기
        </button></Link>
        <div>{data}</div>
    </form>
  
  );
};

export default LoginPage;
