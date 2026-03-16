import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Categories from "./components/Categories/Categories";
import Products from "./components/Products/Products";
import Banners from "./components/Banners/Banners";
import Catalog from "./components/Catalog/Catalog";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import AuthModal from "./components/AuthModal/AuthModal";
import InfoPage from "./components/InfoPage/InfoPage";
import ProductPage from "./components/ProductPage/ProductPage";
import Cart from "./components/Cart/Cart";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Состояние модального окна авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("isAuthenticated")
  ); // Проверка статуса авторизации
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true"); // Проверка роли администратора
  const [productSearchQuery, setProductSearchQuery] = useState(""); // Строка поиска для главной страницы
  const [catalogSearchQuery, setCatalogSearchQuery] = useState(""); // Строка поиска для каталога
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // ID пользователя

  // Обработчик логина
  const handleLogin = (user) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", user.userName);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isAdmin", user.isAdmin); // Сохраняем статус администратора
    setIsAuthenticated(true);
    setIsAdmin(user.isAdmin);
    setUserId(user.id);
    setIsAuthModalOpen(false);
  };

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null);
  };

  return (
    <Router>
      <div className="app">
        {/* Хедер с передачей функций поиска */}
        <Header
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin} // Передаём статус администратора для изменения интерфейса
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onSearchProducts={setProductSearchQuery} // Поиск для Products
          onSearchCatalog={setCatalogSearchQuery} // Поиск для Catalog
        />

        <div className="main-content" />
        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={
              <>
                <Banners />
                <Categories />
                {!isAdmin && <Products searchQuery={productSearchQuery} />} {/* Скрыть для админа */}
              </>
            }
          />

          {/* Страница каталога */}
          <Route
            path="/catalog"
            element={<Catalog searchQuery={catalogSearchQuery} />}
          />

          {/* Страница информации */}
          <Route path="/info" element={<InfoPage />} />

          {/* Страница товара */}
          <Route path="/product/:id" element={<ProductPage />} />

          {/* Страница корзины */}
          <Route
            path="/cart"
            element={
              isAuthenticated ? <Cart /> : <Navigate to="/" replace />
            }
          />

          {/* Страница профиля */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage userId={userId} isAdmin={isAdmin} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>

        {/* Футер */}
        <Footer />

        {/* Модальное окно авторизации */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
}

export default App;
