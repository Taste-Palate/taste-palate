import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 스타일 시트 import
import { Container, Row, Col, Form, Button } from "react-bootstrap"; // 부트스트랩 컴포넌트 import
import axios from "axios";

const MyInfoPage = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  //TODO FIX
  useEffect(() => {
    axios
      .get("/auth/myinfo")
      .then((data) => {
        setUserName(data.data.nick);
        setBio(data.data.selfIntroduction);
      })
      .catch((error) => {
        setUserName(JSON.stringify(error));
        setBio(JSON.stringify(error));
      });
  }, []);

  const handleSave = () => {
    // 서버에 저장 로직 추가
    axios.patch("/auth/myinfo", {
      nick: userName,
      selfIntroduction: bio,
    });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // 서버에 비밀번호 변경 로직 추가
    axios
      .patch("auth/myPassword", {
        currentPassword: currentPassword,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
      })
      .then(() => {
        alert("비밀번호 변경에 성공하였습니다.");
        axios
          .get("auth/logout")
          .then(() => {
            navigate("/");
          })
          .catch(() => {
            alert("원인 모를 오류");
          });
      })
      .catch(() => {
        alert("비밀번호 변경에 실패했습니다.");
      });
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h2>{userName}'s Profile</h2>

          {isEditing ? (
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBio">
                <Form.Label>Bio:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </Form>
          ) : (
            <>
              <p>{bio}</p>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3>Change Password</h3>
          <Form>
            <Form.Group controlId="formNewPassword">
              <Form.Label>현재 비밀번호:</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>새로운 비밀번호:</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>새로운 비밀번호 확인:</Form.Label>
              <Form.Control
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </Form.Group>

            <Button variant="info" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MyInfoPage;
