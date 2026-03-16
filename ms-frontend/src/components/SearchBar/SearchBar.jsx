import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);
  };

  const handleSearchClick = () => {
    onSearch(query); // Передаём строку поиска в родительский компонент
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Поиск товаров..."
        value={query}
        onChange={handleSearchChange}
        className="search-input"
      />
      <button onClick={handleSearchClick} className="search-button">
        Искать
      </button>
    </div>
  );
};

export default SearchBar;
