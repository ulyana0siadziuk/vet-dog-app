import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // Импорт Toaster
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams(); // Получаем ID товара из URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрос на получение данных о товаре
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка загрузки товара: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (productId) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userName = localStorage.getItem("userName");

    if (!isAuthenticated || !userName) {
      toast.error("Вы должны быть авторизованы, чтобы добавить товар в корзину!");
      return;
    }

    if (handleAddToCart.loading) return; // Предотвращаем дублирование
    handleAddToCart.loading = true;

    fetch("http://localhost:8080/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, productId, quantity: 1 }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Товар добавлен в корзину!");
        } else {
          toast.error("Не удалось добавить товар. Попробуйте снова.");
        }
      })
      .catch((error) => {
        console.error("Ошибка добавления товара:", error);
        toast.error("Произошла ошибка. Попробуйте снова.");
      })
      .finally(() => {
        handleAddToCart.loading = false; // Сброс флага
      });
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div className="product-page-container">
      {/* Toaster для уведомлений */}
      <Toaster position="top-right" />

      {/* Название товара */}
      <h1 className="product-title">{product.name}</h1>

      {/* Основной блок с изображением и деталями */}
      <div className="product-details">
        {/* Левая секция: Изображение */}
        <div className="product-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
        </div>

        {/* Правая секция: Цена и кнопка */}
        <div className="product-info">
          <p className="product-price">Цена: {product.price} р.</p>
          <button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(product.id)}
          >
            В корзину
          </button>
        </div>
      </div>

      {/* Описание товара */}
      <div className="product-description">
        <h2 className="description-title">Описание</h2>
        <p className="description-weight">Вес: {product.weight}</p>
        <p className="description-text">{product.description}</p>

      </div>
    </div>
  );
};

export default ProductPage;
