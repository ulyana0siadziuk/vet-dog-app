package net.unicorn.ms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private String userName;       // Имя пользователя
    private Long productId;        // Идентификатор продукта
    private Integer quantity;      // Количество продукта в корзине
    private String productName;    // Название продукта
    private Double productPrice;   // Цена продукта
    private String imageUrl;       // URL изображения продукта
}
