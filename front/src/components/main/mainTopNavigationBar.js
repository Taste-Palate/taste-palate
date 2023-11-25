import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useCallback } from "react";

function MainTopNavigationBar({ isLoggedIn, setIsLoggedIn, search }) {
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청을 보냅니다.
      await axios.get("/auth/logout");

      // 로그아웃 상태를 업데이트합니다.
      setIsLoggedIn(false);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const [value, setVaule] = useState("");

  const onChange = useCallback((e) => {
    setVaule(e.target.value);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    search(value);
  };

  return (
    <Navbar className="bg-body-tertiary">
      <Form inline onSubmit={onSubmit}>
        <Row>
          <Col>
            <input
              value={value}
              onChange={onChange}
              placeholder="Search"
              className=" mr-sm-2"
            />
          </Col>
          <Col>
            <Button type="submit">검색</Button>
          </Col>
        </Row>
      </Form>
      <Navbar.Collapse className="justify-content-end">
      {isLoggedIn && (
          <Form inline>
            <Row>
              <Col>
                <Link to="/myInfoPage">
                  <Button type="button" className=" mr-sm-2" style={{ marginLeft: '10px', marginRight: '10px' }}>
                    내 정보 보기
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        )}
        {isLoggedIn && (
          <Form inline>
            <Row>
              <Col>
                <Link to="/posts">
                  <Button type="button" className=" mr-sm-2" style={{ marginLeft: '10px', marginRight: '10px' }}>
                    게시글 작성
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        )}
        {isLoggedIn && (
          <Form inline>
            <Row>
              <Col>
                <Button type="button" onClick={logout} className=" mr-sm-2" style={{ marginLeft: '10px', marginRight: '10px' }}>
                  로그아웃
                </Button>
              </Col>
            </Row>
          </Form>
        )}
        {!isLoggedIn && (
          <Form inline>
            <Row>
              <Col xs="auto">
                <Link to="/auth/login">
                  <Button type="button" className=" mr-sm-2" style={{ marginLeft: '10px', marginRight: '10px' }}>
                    로그인
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainTopNavigationBar;
