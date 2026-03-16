package net.unicorn.ms.mapper;

import net.unicorn.ms.dto.CartDto;
import net.unicorn.ms.entity.Cart;
import net.unicorn.ms.entity.Product;

public class CartMapper {

    public static CartDto mapToCartDto(Cart cart, Product product) {
        return new CartDto(
                cart.getUserId().toString(),  // userName извлекается из User
                cart.getProductId(),
                cart.getQuantity(),
                product.getName(),            // Название продукта
                product.getPrice(),           // Цена продукта
                product.getImageUrl()         // URL изображения
        );
    }
}
