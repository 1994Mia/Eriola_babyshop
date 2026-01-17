package com.eriola.baby_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eriola.baby_shop.entity.OrderItem;
import com.eriola.baby_shop.entity.Orders;
import com.eriola.baby_shop.entity.Review;
import com.eriola.baby_shop.repository.OrderItemRepository;
import com.eriola.baby_shop.repository.OrderRepository;
import com.eriola.baby_shop.repository.ReviewRepository;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    public Review createReview(Long orderId, Long itemId, Integer rating, String comment, Long userId) {
        // Get the order
        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if order is delivered
        if (!"DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot review. Order must be delivered first");
        }
        
        // Check if user owns this order
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only review your own orders");
        }
        
        // Get order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        
        // Check if the item was in this order
        OrderItem orderItem = orderItems.stream()
            .filter(oi -> oi.getItem().getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("This item was not in your order"));
        
        // Check if already reviewed
        if (reviewRepository.existsByOrderIdAndItemId(orderId, itemId)) {
            throw new RuntimeException("You have already reviewed this product from this order");
        }
        
        // Create review
        Review review = new Review();
        review.setOrder(order);
        review.setItem(orderItem.getItem());
        review.setUser(order.getUser());
        review.setRating(rating);
        review.setComment(comment);
        
        return reviewRepository.save(review);
    }
    
    public List<Review> getItemReviews(Long itemId) {
        return reviewRepository.findByItemId(itemId);
    }
    
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    public boolean canReviewItem(Long orderId, Long itemId, Long userId) {
        Orders order = orderRepository.findById(orderId).orElse(null);
        
        if (order == null || !order.getUser().getId().equals(userId)) {
            return false;
        }
        
        if (!"DELIVERED".equals(order.getStatus())) {
            return false;
        }
        
        if (reviewRepository.existsByOrderIdAndItemId(orderId, itemId)) {
            return false;
        }
        
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        return orderItems.stream()
            .anyMatch(oi -> oi.getItem().getId().equals(itemId));
    }
}