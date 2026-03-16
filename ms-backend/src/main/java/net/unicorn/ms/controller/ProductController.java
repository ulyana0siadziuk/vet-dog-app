package net.unicorn.ms.controller;

import lombok.AllArgsConstructor;
import net.unicorn.ms.dto.ProductDto;
import net.unicorn.ms.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // Create Product REST API
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        ProductDto savedProduct = productService.createProduct(productDto);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // Get Product By ID REST API
    @GetMapping("{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long productId) {
        ProductDto productDto = productService.getProductById(productId);
        return ResponseEntity.ok(productDto);
    }

    // Get All Products REST API
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    // Update Product REST API
    @PutMapping("{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") Long productId, @RequestBody ProductDto updatedProduct) {
        // Проверка обязательных полей
        if (updatedProduct.getPrice() == null || updatedProduct.getName() == null) {
            return ResponseEntity.badRequest().body("Цена и имя продукта не могут быть пустыми.");
        }


        try {
            ProductDto productDto = productService.updateProduct(productId, updatedProduct);
            return ResponseEntity.ok(productDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при обновлении продукта: " + e.getMessage());
        }
    }

    // Delete Product REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully!");
    }
    // Новый метод для получения категорий
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getCategories();
        return ResponseEntity.ok(categories);
    }
}
