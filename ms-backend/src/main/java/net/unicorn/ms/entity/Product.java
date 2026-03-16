package net.unicorn.ms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column
    private String weight;

    @Column(name = "image_url")
    private String imageUrl;

    @Column
    private Double discount;

    @Column(name = "category")
    private String categoryId;

    // Конструктор с полями
    public Product(Long id, String name, String description, Double price, String weight, String imageUrl, Double discount, String categoryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.weight = weight;
        this.imageUrl = imageUrl;
        this.discount = discount;
        this.categoryId = categoryId;
    }
    // Пустой конструктор (обязателен для JPA)
    public Product() {}
}
