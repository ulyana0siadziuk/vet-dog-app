import React, { useState } from 'react';
import './AuthModal.css';
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', user.userName);
        localStorage.setItem('isAdmin', user.isAdmin); // Сохраняем статус администратора
        localStorage.setItem('email', user.email);

        toast.success("Вы успешно авторизованы!");
        onLogin(user);
        setFormData({ email: '', password: '' });
        onClose();
      } else {
        setErrors({ email: 'Неверный email или пароль.' });
        setMessage('');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      toast.error("Ошибка соединения с сервером.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          userName: formData.userName,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success("Вы успешно зарегистрировались!");
        setFormData({ email: '', userName: '', password: '', confirmPassword: '' });
        setErrors({});
      } else if (response.status === 409) {
        setErrors({ email: 'Пользователь с таким email уже зарегистрирован.' });
        setMessage('');
      } else {
        toast.error("Произошла ошибка. Попробуйте снова.");
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      toast.error("Ошибка соединения с сервером.");
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.email) validationErrors.email = 'Email обязателен';
    if (!formData.userName && !isLogin) validationErrors.userName = 'Имя пользователя обязательно';
    if (!formData.password) validationErrors.password = 'Пароль обязателен';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Пароли не совпадают';
    }
    return validationErrors;
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <button
            className={`tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setMessage('');
              setErrors({});
            }}
          >
            Войти
          </button>
          <button
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setMessage('');
              setErrors({});
            }}
          >
            Регистрация
          </button>
        </div>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <p>Введите ваши данные для входа.</p>
            <input
              type="email"
              name="email"
              placeholder="Ваш e-mail"
              value={formData.email}
              onChange={handleChange}
              className={`block-form ${errors.email ? 'error-input' : ''}`}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className="block-form"
              required
            />
            <button className="auth-button" type="submit">
              Войти
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <p>Заполните данные для регистрации.</p>
            <input
              type="email"
              name="email"
              placeholder="Ваш e-mail"
              value={formData.email}
              onChange={handleChange}
              className={`block-form ${errors.email ? 'error-input' : ''}`}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            <input
              type="text"
              name="userName"
              placeholder="Имя пользователя"
              value={formData.userName}
              onChange={handleChange}
              className={`block-form ${errors.userName ? 'error-input' : ''}`}
              required
            />
            {errors.userName && <p className="error-text">{errors.userName}</p>}
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className={`block-form ${errors.password ? 'error-input' : ''}`}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block-form ${errors.confirmPassword ? 'error-input' : ''}`}
              required
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            <button className="auth-button" type="submit">
              Регистрация
            </button>
          </form>
        )}
        {message && <p className="message-text">{message}</p>}
      </div>
    </div>
  );
};

export default AuthModal;
