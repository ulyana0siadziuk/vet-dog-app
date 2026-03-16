import React from 'react';
import './Footer.css';  // Здесь будут стили для Footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 VetDog. Все права защищены.</p>
        <nav className="footer-nav">
          <p1>Условия использования</p1>
          <p1>Политика конфиденциальности</p1>
          <p1>+375 (29) 597-59-44</p1>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
