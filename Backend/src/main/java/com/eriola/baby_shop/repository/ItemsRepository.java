package com.eriola.baby_shop.repository;

import com.eriola.baby_shop.entity.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemsRepository extends JpaRepository<Items, Long> {
    
    List<Items> findByCategory(String category);
    
    List<Items> findByNameContainingIgnoreCase(String name);
}