import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Catalog.css";
import toast from "react-hot-toast";
// import { Settings } from '/lucide-react';

const categoryMapping = {
  dogs: "Собаки",
  cat: "Кошки",
  rodents: "Грызуны",
  birds: "Птицы",
  "fish-reptiles": "Рыбы/Рептилии",
};

const reverseCategoryMapping = Object.fromEntries(
  Object.entries(categoryMapping).map(([key, value]) => [value, key])
);

const Catalog = ({ searchQuery }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const categoryRefs = useRef({});
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/products/categories").then((res) =>
        res.json()
      ),
      fetch("http://localhost:8080/api/products").then((res) => res.json()),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        toast.error("Ошибка загрузки данных.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    if (category && categoryRefs.current[categoryMapping[category]]) {
      const element = categoryRefs.current[categoryMapping[category]];
      const offset = 70;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [categories, location.search]);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        toast.success("Товар удалён!");
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        toast.error("Ошибка при удалении товара.");
      }
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
      toast.error("Ошибка соединения с сервером.");
    }
  };

  const handleEditProduct = async (productId, field, currentValue) => {
    const newValue = prompt(`Введите новое значение для ${field}:`, currentValue);
    if (newValue === null || newValue.trim() === "") {
      toast.error("Значение не может быть пустым.");
      return;
    }

    const updatedProduct = products.find((product) => product.id === productId);
    updatedProduct[field] = newValue;

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        toast.success("Товар обновлён!");
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, [field]: newValue } : product
          )
        );
      } else {
        toast.error("Ошибка при обновлении товара.");
      }
    } catch (error) {
      console.error("Ошибка обновления товара:", error);
      toast.error("Ошибка соединения с сервером.");
    }
  };

  const handleAddToCart = (productId) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userName = localStorage.getItem("userName");

    if (!isAuthenticated || !userName) {
      toast.error("Вы должны быть авторизованы, чтобы добавить товар в корзину!");
      return;
    }

    fetch("http://localhost:8080/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
            toast.error(error.message || "Не удалось добавить товар.");
          });
        }
      })
      .catch((error) => {
        console.error("Ошибка добавления товара в корзину:", error);
        toast.error("Произошла ошибка. Попробуйте снова.");
      });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, createdProduct]);
        setFilteredProducts((prevFiltered) => [...prevFiltered, createdProduct]);
        toast.success(`Товар "${createdProduct.name}" успешно добавлен!`);
      } else {
        toast.error("Ошибка при добавлении товара.");
      }
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
      toast.error("Произошла ошибка. Попробуйте снова.");
    }
  };


  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="catalog-container-custom">
      {categories.map((category) => {
        const categoryKey = reverseCategoryMapping[category] || category;
        const filteredCategoryProducts = filteredProducts.filter(
          (product) => product.categoryId === category
        );

        return (
          <div
            key={categoryKey}
            className="category-block-custom"
            ref={(el) => (categoryRefs.current[category] = el)}
          >
            <div className="category-header-custom">
              <h2 className="category-title-custom">{category}</h2>
              {isAdmin && (
                <button
                  className="add-product-button-custom"
                  onClick={() => {
                    const newProduct = {
                      name: prompt("Введите название товара:"),
                      description: prompt("Введите описание товара:"),
                      weight: prompt("Введите вес товара:"),
                      price: parseFloat(prompt("Введите цену товара:")),
                      discount: parseInt(prompt("Введите скидку на товар (в %):"), 10) || 0,
                      categoryId: category,
                      imageUrl: prompt("Введите URL изображения товара:"),
                    };

                    // Проверяем, что обязательные поля заполнены
                    if (
                      !newProduct.name ||
                      !newProduct.description ||
                      !newProduct.weight ||
                      isNaN(newProduct.price) ||
                      !newProduct.imageUrl
                    ) {
                      toast.error("Все поля должны быть заполнены корректно.");
                      return;
                    }

                    // Подтверждение добавления
                    const confirmAdd = window.confirm(
                      `Вы уверены, что хотите добавить товар "${newProduct.name}" в категорию "${category}"?`
                    );

                    if (confirmAdd) {
                      handleAddProduct(newProduct); // Логика добавления
                    }
                  }}
                >
                  Добавить товар
                </button>
              )}
            </div>
            <div
              className={`catalog-main-custom ${filteredCategoryProducts.length === 2 ? "two-items" : ""
                }`}
            >
              {filteredCategoryProducts.length > 0 ? (
                filteredCategoryProducts.map((product) => (
                  <div
                    key={`product-${product.id}`}
                    className="product-card-container-custom"
                    onClick={() => !isAdmin && handleProductClick(product.id)}
                    style={{ cursor: isAdmin ? "default" : "pointer" }}
                  >
                    <div className="product-card-custom">
                      <div className="product-header-custom">
                        {product.discount > 0 ? (
                          <div className="product-discount-tag-custom">
                            -{product.discount}%
                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProduct(product.id, "discount", product.discount);
                                }}
                                className="edit-button"
                              >
                                <img src={"/settings.svg"} alt="Edit" />
                              </button>
                            )}
                          </div>
                        ) : (
                          isAdmin && (
                            <div className="product-discount-tag-custom">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProduct(product.id, "discount", "0");
                                }}
                                className="edit-button"
                              >
                                <img src={"/settings.svg"} alt="Add Discount" />
                              </button>
                            </div>
                          )
                        )}

                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-image-custom"
                        />
                      </div>
                      <h3 className="product-name-custom">
                        {product.name}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id, "name", product.name);
                            }}
                            className="edit-button"
                          >
                            <img src={'/settings.svg'} />
                          </button>
                        )}
                      </h3>
                      <p className="product-description-custom2">
                        {product.description}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id, "description", product.description);
                            }}
                            className="edit-button"
                          >
                            <img src={'/settings.svg'} />
                          </button>
                        )}
                      </p>
                      <p className="product-weight-custom">
                        Вес: {product.weight}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id, "weight", product.weight);
                            }}
                            className="edit-button"
                          >
                            <img src={'/settings.svg'} />
                          </button>
                        )}
                      </p>
                      <div className="product-price-custom">
                        <span className="product-current-price-custom">
                          {product.price} р.
                        </span>
                        {product.discount > 0 && (
                          <span className="product-original-price-custom">
                            {(product.price / (1 - product.discount / 100)).toFixed(2)} р.
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id, "price", product.price);
                            }}
                            className="edit-button"
                          >
                            <img src={'/settings.svg'} />
                          </button>
                        )}
                      </div>
                      {isAdmin ? (
                        <button
                          className="delete-button-custom"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                        >
                          Удалить
                        </button>
                      ) : (
                        <button
                          className="add-to-cart-btn-custom"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                        >
                          В корзину
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>Нет товаров для отображения.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Catalog;
