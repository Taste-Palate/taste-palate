import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/main/mainPage';
import LoginPage from './components/login/loginPage';
import JoinPage from './components/join/joinPage';
import PostsPage from './components/postsPage/postsPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/join" element={<JoinPage />} />
          <Route path="/posts" element={<PostsPage />} />
          </Routes>
    </Router>
  );
}

export default App;

