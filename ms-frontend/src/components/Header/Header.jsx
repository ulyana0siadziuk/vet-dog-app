import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

function Header({
  isAuthenticated,
  isAdmin, // Флаг администратора
  onOpenAuthModal,
  onLogout,
  onSearchProducts,
  onSearchCatalog,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleSearchClick = () => {
    if (location.pathname === "/") {
      onSearchProducts(searchQuery);
    } else if (location.pathname === "/catalog") {
      onSearchCatalog(searchQuery);
    }
  };

  const handleCatalogClick = () => navigate("/catalog");
  const handleProfileClick = () => navigate("/profile");

  return (
    <header className="header">
      {/* Логотип */}
      <div className="header-logo">
        <a href="/" className="logo-link">
          <img src="/header-icon.png" alt="Логотип" className="logo-image" />
          <h1>VetDog</h1>
        </a>
      </div>

      {/* Если пользователь - администратор */}
      {isAdmin ? (
        <>
          <div style={{ 'width': '700px' }}></div>
          <div className="admin-header-buttons">
            <button className="header-button" onClick={handleCatalogClick}>
              Каталог
            </button>
            <button className="header-button" onClick={handleProfileClick}>
              Личный кабинет
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Поиск для обычного пользователя */}
          <div className="header-search">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button onClick={handleSearchClick} className="search-button">
              Искать
            </button>
          </div>

          {/* Кнопки для обычного пользователя */}
          <div className="header-buttons">
            <button className="header-button" onClick={handleCatalogClick}>
              Каталог
            </button>
            <button className="header-button" onClick={() => navigate("/info")}>
              Информация
            </button>
            <div className="header-icons">
              <img
                src="/shopping-bag.svg"
                alt="Корзина"
                className="header-shop-icon"
                onClick={() => {
                  isAuthenticated ? navigate("/cart") : onOpenAuthModal();
                }}
              />
              {isAuthenticated ? (
                <img
                  src="/profile.svg"
                  alt="Профиль"
                  className="header-icon"
                  onClick={handleProfileClick}
                />
              ) : (
                <img
                  src="/user.svg"
                  alt="Личный кабинет"
                  className="header-icon"
                  onClick={onOpenAuthModal}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Кнопка выхода */}
      {isAuthenticated && (
        <button className="logout-button" onClick={onLogout}>
          Выйти
        </button>
      )}
    </header>
  );
}

export default Header;
