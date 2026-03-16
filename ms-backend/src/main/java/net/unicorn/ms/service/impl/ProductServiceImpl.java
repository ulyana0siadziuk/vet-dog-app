package net.unicorn.ms.service.impl;

import lombok.AllArgsConstructor;
import net.unicorn.ms.dto.ProductDto;
import net.unicorn.ms.entity.Product;
import net.unicorn.ms.exception.ResourceNotFoundException;
import net.unicorn.ms.mapper.ProductMapper;
import net.unicorn.ms.repository.ProductRepository;
import net.unicorn.ms.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = ProductMapper.mapToProduct(productDto);
        Product savedProduct = productRepository.save(product);
        return ProductMapper.mapToProductDto(savedProduct);
    }

    @Override
    public ProductDto getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product does not exist with given id: " + productId));
        return ProductMapper.mapToProductDto(product);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(ProductMapper::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto updateProduct(Long productId, ProductDto updatedProduct) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product does not exist with given id: " + productId));

        // Обновляем поля
        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setWeight(updatedProduct.getWeight());
        product.setImageUrl(updatedProduct.getImageUrl());
        product.setDiscount(updatedProduct.getDiscount());
        product.setCategoryId(updatedProduct.getCategoryId());

        Product updatedProductObj = productRepository.save(product);
        return ProductMapper.mapToProductDto(updatedProductObj);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product does not exist with given id: " + productId));
        productRepository.deleteById(productId);
    }

    @Override
    public List<String> getCategories() {
        return productRepository.findDistinctCategories(); // Используем метод репозитория
    }
}
