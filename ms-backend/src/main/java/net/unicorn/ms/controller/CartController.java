package net.unicorn.ms.controller;

import lombok.RequiredArgsConstructor;
import net.unicorn.ms.dto.CartDto;
import net.unicorn.ms.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    // Получить корзину пользователя
    @GetMapping("/{userName}")
    public ResponseEntity<List<CartDto>> getCartByUserName(@PathVariable String userName) {
        return ResponseEntity.ok(cartService.getCartByUserName(userName));
    }

    // Добавить товар в корзину
    @PostMapping
    public ResponseEntity<?> addProductToCart(@RequestBody CartDto cartDto,
                                              @RequestParam(value = "isAdmin", required = false) boolean isAdmin) {
        if (isAdmin) {
            return ResponseEntity.badRequest().body("Администратор не может добавлять товары в корзину.");
        }
        return ResponseEntity.status(201).body(cartService.addProductToCart(cartDto));
    }

    // Удалить товар из корзины
    @DeleteMapping("/{userName}/{productId}")
    public ResponseEntity<?> deleteProductFromCart(@PathVariable String userName,
                                                   @PathVariable Long productId,
                                                   @RequestParam(value = "isAdmin", required = false) boolean isAdmin) {
        if (isAdmin) {
            return ResponseEntity.badRequest().body("Администратор не может удалять товары из корзины.");
        }
        cartService.deleteProductFromCart(userName, productId);
        return ResponseEntity.noContent().build();
    }

    // Обновить количество товара в корзине
    @PostMapping("/update")
    public ResponseEntity<?> updateProductQuantity(@RequestBody CartDto cartDto,
                                                   @RequestParam(value = "isAdmin", required = false) boolean isAdmin) {
        if (isAdmin) {
            return ResponseEntity.badRequest().body("Администратор не может изменять количество товаров в корзине.");
        }
        return ResponseEntity.ok(cartService.updateProductQuantity(cartDto));
    }
}
