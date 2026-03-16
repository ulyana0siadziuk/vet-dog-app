import React from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const categories = [
    { id: 1, name: "Собаки", img: "/DOG.webp", bgColor: "#CD5C5C", link: "dogs" },
    { id: 2, name: "Кошки", img: "/CAT.webp", bgColor: "LightSkyBlue", link: "cat" },
    { id: 3, name: "Грызуны", img: "/GRYZUNY.webp", bgColor: "#FFA500", link: "rodents" },
    { id: 4, name: "Птицы", img: "/PTITSY.webp", bgColor: "#FFB6C1", link: "birds" },
    { id: 5, name: "Рыбы/Рептилии", img: "/FISH.webp", bgColor: "#98FB98", link: "fish-reptiles" },
  ];

  const navigate = useNavigate();

  // Переход на страницу с параметром категории
  const handleCategoryClick = (categoryLink) => {
    navigate(`/catalog?category=${categoryLink}`);
  };

  return (
    <div className="categories-container">
      {categories.map(({ id, name, img, bgColor, link }) => (
        <div
          key={id}
          className="category-button"
          style={{ backgroundColor: bgColor }}
          onClick={() => handleCategoryClick(link)}
        >
          <img src={img} alt={name} className="category-icon" />
          <p className="category-name">{name}</p>
        </div>
      ))}
    </div>
  );
};

export default Categories;
