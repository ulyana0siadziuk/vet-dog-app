import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Products.css";

const Products = ({ searchQuery }) => {
  const [products, setProducts] = useState([]); // Все товары (первые 5)
  const [filteredProducts, setFilteredProducts] = useState([]); // Отфильтрованные товары
  const navigate = useNavigate();

  // Создаём ref для заголовка "Рекомендации для вас"
  const recommendationsRef = useRef(null);

  // Загружаем только 5 товаров с сервера
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const limitedProducts = data.slice(0, 5); // Ограничиваем список до 5 товаров
        setProducts(limitedProducts);
        setFilteredProducts(limitedProducts); // Инициализируем отфильтрованные товары
      })
      .catch((error) => {
        console.error("Ошибка при загрузке товаров:", error);
        toast.error("Не удалось загрузить товары.");
      });
  }, []);

  // Фильтрация товаров при изменении строки поиска
  useEffect(() => {
    if (searchQuery) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);

      // Прокрутка к заголовку после поиска
      recommendationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setFilteredProducts(products); // Если строка поиска пустая, отображаем все 5 товаров
    }
  }, [searchQuery, products]);

  // Переход на страницу товара
  const handleCardClick = (id, event) => {
    if (event.target.tagName !== "BUTTON") {
      navigate(`/product/${id}`);
    }
  };

  // Добавление товара в корзину
  const handleAddToCart = (productId) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userName = localStorage.getItem("userName");

    if (!isAuthenticated || !userName) {
      toast.error("Вы должны быть авторизованы, чтобы добавить товар в корзину!");
      return;
    }

    fetch("http://localhost:8080/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        productId,
        quantity: 1,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Товар добавлен в корзину!");
        } else {
          return response.json().then((error) => {
            toast.error(error.message || "Не удалось добавить товар. Попробуйте снова.");
          });
        }
      })
      .catch((error) => {
        console.error("Ошибка добавления товара в корзину:", error);
        toast.error("Произошла ошибка. Попробуйте снова.");
      });
  };

  return (
    <div className="products-wrapper-custom">
      {/* Заголовок с ref для прокрутки */}
      <h2 ref={recommendationsRef} className="products-main-heading-custom">
        Рекомендации для вас
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="no-results-message">Товары не найдены.</p>
      ) : (
        <div className="products-container-custom">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card-custom"
              onClick={(event) => handleCardClick(product.id, event)}
            >
              <div className="product-header-custom">
                {product.discount > 0 && (
                  <div className="product-discount-tag-custom">
                    -{product.discount}%
                  </div>
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image-custom"
                />
              </div>
              <h3 className="product-name-custom">{product.name}</h3>
              <p className="product-description-custom">{product.description}</p>
              <p className="product-weight-custom">Вес: {product.weight}</p>
              <div className="product-price-custom">
                Цена:{" "}
                <span className="product-current-price-custom">
                  {product.price} р.
                </span>
                {product.discount > 0 && (
                  <span className="product-original-price-custom">
                    {(product.price / (1 - product.discount / 100)).toFixed(2)} р.
                  </span>
                )}
              </div>
              <button
                className="add-to-cart-btn-custom"
                onClick={(event) => {
                  event.stopPropagation(); // Предотвращаем переход при клике на кнопку
                  handleAddToCart(product.id);
                }}
              >
                В корзину
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
