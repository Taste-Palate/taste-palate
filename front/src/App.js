import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/main/mainPage';
import LoginPage from './components/login/loginPage';
import JoinPage from './components/join/joinPage';
import PostAddPage from './components/postsPage/postAddPage';
import MyInfoPage from './components/myInfoPage.js/myInfoPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/join" element={<JoinPage />} />
          <Route path="/posts" element={<PostAddPage />} />
          <Route path="/myInfoPage" element={<MyInfoPage />} />
          </Routes>
    </Router>
  );
}

export default App;

