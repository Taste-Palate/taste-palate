import { Link } from "react-router-dom";
import './mainTopNavigationBar.scss'

const MainTopNavigationBar = () => {
  return (
    <div className="navigation">
      <Link to="/posts"><input type="button" value={`게시글 작성`}></input></Link>
      <Link to="/auth/login"><input type="button" value={`로그인`}></input></Link>
    </div>
  )
}

export default MainTopNavigationBar;