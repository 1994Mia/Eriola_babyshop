package com.eriola.baby_shop.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eriola.baby_shop.entity.Items;

@Repository
public interface ItemsRepository extends JpaRepository<Items, Long> {
    
    List<Items> findByCategory(String category);
    
    List<Items> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT i FROM Items i LEFT JOIN Review r ON r.item.id = i.id " +
           "GROUP BY i.id ORDER BY COUNT(r.id) DESC")
    List<Items> findMostReviewedItems(Pageable pageable);
}