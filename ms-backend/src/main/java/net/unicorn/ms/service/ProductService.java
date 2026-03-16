package net.unicorn.ms.service;

import net.unicorn.ms.dto.ProductDto;

import java.util.List;

public interface ProductService {

    ProductDto createProduct(ProductDto productDto);

    ProductDto getProductById(Long productId);

    List<ProductDto> getAllProducts();

    ProductDto updateProduct(Long productId, ProductDto updatedProduct);

    void deleteProduct(Long productId);

    // Новый метод для получения уникальных категорий
    List<String> getCategories();
}
