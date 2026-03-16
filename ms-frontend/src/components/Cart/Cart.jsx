import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // Toaster для уведомлений
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Загрузка данных корзины и продуктов
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    fetch(`http://localhost:8080/api/cart/${userName}`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки корзины:', error);
        setLoading(false);
      });

    // Загрузка всех продуктов для получения цен
    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Ошибка загрузки продуктов:', error);
      });
  }, []);

  // Удаление товара из корзины
  const handleRemoveFromCart = (productId) => {
    const userName = localStorage.getItem('userName');
    fetch(`http://localhost:8080/api/cart/${userName}/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setCartItems(cartItems.filter((item) => item.productId !== productId));
          toast.success('Товар удалён из корзины!');
        }
      })
      .catch((error) => {
        console.error('Ошибка удаления товара:', error);
      });
  };

  // Изменение количества товара
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Нельзя уменьшить количество ниже 1
    const userName = localStorage.getItem('userName');

    fetch('http://localhost:8080/api/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        productId,
        quantity: newQuantity,
      }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setCartItems(cartItems.map(item =>
          item.productId === productId ? { ...item, quantity: updatedItem.quantity } : item
        ));
      })
      .catch((error) => {
        console.error('Ошибка обновления количества товара:', error);
      });
  };

  // Функция для получения цены товара из списка продуктов
  const getProductPrice = (productId) => {
    const product = products.find(product => product.id === productId);
    return product ? product.price : 0;
  };

  // Функция для получения скидки товара
  const getProductDiscount = (productId) => {
    const product = products.find(product => product.id === productId);
    return product ? product.discount : 0;
  };

  // Функция для расчёта денежного эквивалента скидки
  const calculateDiscountValue = (price, discountPercentage) => {
    return price * (discountPercentage / 100);
  };

  // Округление до двух знаков после запятой
  const roundToTwoDecimalPlaces = (value) => {
    return parseFloat(value.toFixed(2));  // Округляет до двух знаков
  };

  // Подсчёт общей стоимости корзины без скидки (только суммы цен товаров)
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const productPrice = getProductPrice(item.productId);
      return total + (productPrice * item.quantity); // Просто сумма всех цен товаров
    }, 0);
  };

  // Подсчёт "Цены без скидки" (цена товара + скидка для каждого товара)
  const getTotalPriceWithDiscount = () => {
    return cartItems.reduce((total, item) => {
      const productPrice = getProductPrice(item.productId);
      const productDiscount = getProductDiscount(item.productId);
      const discountValue = calculateDiscountValue(productPrice, productDiscount);
      return total + (productPrice + discountValue) * item.quantity; // Сумма всех товаров + скидки
    }, 0);
  };

  // Подсчёт общей скидки для корзины
  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      const productPrice = getProductPrice(item.productId);
      const productDiscount = getProductDiscount(item.productId);
      const discountValue = calculateDiscountValue(productPrice, productDiscount);
      return total + (discountValue * item.quantity); // Сумма скидки для каждого товара
    }, 0);
  };

  if (loading) {
    return <div className="cart-loading">Загрузка корзины...</div>;
  }

  if (cartItems.length === 0) {
    return <div className="cart-empty">Ваша корзина пуста.</div>;
  }

  const totalPrice = getTotalPrice();
  const totalPriceWithDiscount = getTotalPriceWithDiscount();  // Сумма цены + скидки
  const finalPrice = totalPriceWithDiscount;

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h1>Моя корзина</h1>
        {cartItems.map((item) => {
          const productPrice = getProductPrice(item.productId);
          const productDiscount = getProductDiscount(item.productId);
          const discountValue = calculateDiscountValue(productPrice, productDiscount);

          return (
            <div key={item.productId} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <div className="cart-item-quantity">
                  <button
                    className="cart-item-quantity-button"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <p>Количество: {item.quantity}</p>
                  <button
                    className="cart-item-quantity-button"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-price">
                  <p>Цена: {roundToTwoDecimalPlaces(productPrice)} р.</p>
                  <p>Общая цена: {roundToTwoDecimalPlaces(productPrice * item.quantity)} р.</p>
                  <p>Скидка: -{roundToTwoDecimalPlaces(discountValue * item.quantity)} р.</p> {/* Показываем скидку */}
                </div>
              </div>
              <button
                className="cart-remove-button"
                onClick={() => handleRemoveFromCart(item.productId)}
              >
                Удалить
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Ваш заказ</h3>
        <p>Скидка: -{roundToTwoDecimalPlaces(getTotalDiscount())} р.</p> {/* Общая скидка */}
        <p>Цена без скидки: {roundToTwoDecimalPlaces(totalPriceWithDiscount)} р.</p> {/* Цена без скидки */}
        <p className="total-price">Итого: {roundToTwoDecimalPlaces(totalPrice)} р.</p> {/* Итого: просто сумма всех товаров */}
      </div>
    </div>
  );
};

export default Cart;
