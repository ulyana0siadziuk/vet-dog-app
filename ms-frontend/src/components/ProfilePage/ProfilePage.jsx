import React, { useEffect, useState } from 'react';
import './ProfilePage.css'; // Стили

const ProfilePage = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("userId не передан или равен null");
      return;
    }

    // Запрос данных пользователя
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Ошибка при загрузке данных:', response.status);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div className="profile-page">Загрузка...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile">
        <div className="profile-picture">
          <img src="/sobaka.jpg" alt="Профиль" />
        </div>
        <h1 className="user-name">{userData.userName}</h1>
        {/* Подпись Admin, если пользователь является администратором */}
        {userData.admin && <p className="admin-badge">Admin</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
