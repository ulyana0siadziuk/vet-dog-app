package net.unicorn.ms.mapper;

import net.unicorn.ms.dto.ProductDto;
import net.unicorn.ms.entity.Product;

public class ProductMapper {

    public static ProductDto mapToProductDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getWeight(),
                product.getImageUrl(),
                product.getDiscount(),
                product.getCategoryId() // Никакого приведения не требуется
        );
    }

    public static Product mapToProduct(ProductDto dto) {
        return new Product(
                dto.getId(),
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getWeight(),
                dto.getImageUrl(),
                dto.getDiscount(),
                dto.getCategoryId() // Никакого приведения не требуется
        );
    }
}

