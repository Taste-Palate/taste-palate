import { useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import './mainTopSearchBar.scss'

const MainTopSearchBar = ({search}) => {
  const [value, setVaule] = useState("");

  const onChange = useCallback((e) => {
    setVaule(e.target.value);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    search(value);
  }

  return (
    <form className="SearchBar" onSubmit={onSubmit}>
      <input
        placeholder="음식 맛집을 찾아보세요."
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        <CiSearch />
      </button>
    </form>
  );
};

export default MainTopSearchBar;
