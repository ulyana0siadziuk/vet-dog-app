package net.unicorn.ms.service;

import net.unicorn.ms.dto.CartDto;

import java.util.List;

public interface CartService {
    List<CartDto> getCartByUserName(String userName);

    CartDto addProductToCart(CartDto cartDto);

    void deleteProductFromCart(String userName, Long productId);

    CartDto updateProductQuantity(CartDto cartDto);
}
