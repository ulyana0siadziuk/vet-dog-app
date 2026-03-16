package net.unicorn.ms.repository;

import net.unicorn.ms.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Запрос для получения уникальных категорий
    @Query("SELECT DISTINCT p.categoryId FROM Product p")
    List<String> findDistinctCategories();
}
