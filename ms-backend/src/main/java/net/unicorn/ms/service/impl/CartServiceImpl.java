package net.unicorn.ms.service.impl;

import lombok.RequiredArgsConstructor;
import net.unicorn.ms.dto.CartDto;
import net.unicorn.ms.entity.Cart;
import net.unicorn.ms.entity.Product;
import net.unicorn.ms.entity.User;
import net.unicorn.ms.exception.ResourceNotFoundException;
import net.unicorn.ms.mapper.CartMapper;
import net.unicorn.ms.repository.CartRepository;
import net.unicorn.ms.repository.ProductRepository;
import net.unicorn.ms.repository.UserRepository;
import net.unicorn.ms.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CartDto> getCartByUserName(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден: " + userName));

        List<Cart> cartItems = cartRepository.findByUserId(user.getId());
        return cartItems.stream().map(cart -> {
            Product product = productRepository.findById(cart.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден: " + cart.getProductId()));
            return CartMapper.mapToCartDto(cart, product);
        }).toList();
    }

    @Override
    @Transactional
    public CartDto addProductToCart(CartDto cartDto) {
        User user = userRepository.findByUserName(cartDto.getUserName())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден: " + cartDto.getUserName()));

        Cart cart = cartRepository.findByUserIdAndProductId(user.getId(), cartDto.getProductId())
                .orElse(new Cart(null, user.getId(), cartDto.getProductId(), 0));

        cart.setQuantity(cart.getQuantity() + cartDto.getQuantity());
        Cart savedCart = cartRepository.save(cart);

        Product product = productRepository.findById(cartDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден: " + cartDto.getProductId()));

        return CartMapper.mapToCartDto(savedCart, product);
    }

    @Override
    @Transactional
    public void deleteProductFromCart(String userName, Long productId) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден: " + userName));

        cartRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    @Override
    @Transactional
    public CartDto updateProductQuantity(CartDto cartDto) {
        User user = userRepository.findByUserName(cartDto.getUserName())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден: " + cartDto.getUserName()));

        Product product = productRepository.findById(cartDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден: " + cartDto.getProductId()));

        Cart cart = cartRepository.findByUserIdAndProductId(user.getId(), cartDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Продукт не найден в корзине"));

        cart.setQuantity(cartDto.getQuantity());
        Cart updatedCart = cartRepository.save(cart);

        return CartMapper.mapToCartDto(updatedCart, product);
    }
}
