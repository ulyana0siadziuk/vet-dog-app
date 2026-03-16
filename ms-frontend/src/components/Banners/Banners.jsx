import React, { useEffect, useState } from 'react';
import './Banners.css';
import toast from 'react-hot-toast';

const Banners = () => {
  const [banners, setBanners] = useState([]); // Список баннеров
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newBannerUrl, setNewBannerUrl] = useState(''); // URL для нового баннера
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Проверка статуса администратора

  // Загрузка баннеров с сервера
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/banners');
      const data = await response.json();
      setBanners(data);
      setCurrentIndex(0); // Сброс индекса при обновлении баннеров
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
      toast.error('Ошибка загрузки баннеров');
    }
  };

  // Добавление нового баннера
  const handleAddBanner = async () => {
    if (!newBannerUrl.trim()) {
      toast.error('URL баннера не может быть пустым');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newBannerUrl }),
      });

      if (response.ok) {
        toast.success('Баннер успешно добавлен');
        setNewBannerUrl('');
        fetchBanners(); // Обновить список баннеров
      } else {
        toast.error('Ошибка при добавлении баннера');
      }
    } catch (error) {
      console.error('Ошибка добавления баннера:', error);
      toast.error('Ошибка соединения с сервером');
    }
  };

  // Удаление баннера
  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/banners/${bannerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Баннер удалён');
        fetchBanners(); // Обновить список баннеров
        // Сброс индекса, если текущий индекс выходит за пределы нового массива
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
      } else {
        toast.error('Ошибка при удалении баннера');
      }
    } catch (error) {
      console.error('Ошибка удаления баннера:', error);
      toast.error('Ошибка соединения с сервером');
    }
  };

  const nextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="banners-container">
      {banners.length > 0 && (
        <>
          <div className="banner">
            <img
              src={banners[currentIndex]?.imageUrl}
              alt={`Banner ${currentIndex}`}
              className="banner-image"
            />
          </div>
          <button className="prev-button" onClick={prevBanner}>
            &#8592;
          </button>
          <button className="next-button" onClick={nextBanner}>
            &#8594;
          </button>
        </>
      )}

      {/* Форма для добавления и удаления баннера - доступна только администратору */}
      {isAdmin && (
        <div className="banner-admin-panel">
          <input
            type="text"
            placeholder="Введите URL нового баннера"
            value={newBannerUrl}
            onChange={(e) => setNewBannerUrl(e.target.value)}
            className="banner-input"
          />
          <div className="banner-buttons">
            <button onClick={handleAddBanner} className="add-banner-button">
              Добавить баннер
            </button>
            {banners.length > 0 && (
              <button
                className="delete-banner-button"
                onClick={() => handleDeleteBanner(banners[currentIndex]?.id)}
              >
                Удалить баннер
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
