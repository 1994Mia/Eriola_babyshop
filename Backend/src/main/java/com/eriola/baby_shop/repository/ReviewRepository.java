package com.eriola.baby_shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eriola.baby_shop.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByItemId(Long itemId);
    
    List<Review> findByUserId(Long userId);
    
    boolean existsByOrderIdAndItemId(Long orderId, Long itemId);
    
    Optional<Review> findByOrderIdAndItemId(Long orderId, Long itemId);
    
    @Query("SELECT r FROM Review r WHERE r.item.id = :itemId ORDER BY r.createdAt DESC")
    List<Review> findRecentReviewsByItemId(Long itemId);
}