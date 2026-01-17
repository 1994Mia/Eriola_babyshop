package com.eriola.baby_shop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eriola.baby_shop.entity.Review;
import com.eriola.baby_shop.entity.User;
import com.eriola.baby_shop.repository.UserRepository;
import com.eriola.baby_shop.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/order/{orderId}/item/{itemId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Object> reviewData,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Integer rating = (Integer) reviewData.get("rating");
            String comment = (String) reviewData.get("comment");
            
            Review review = reviewService.createReview(orderId, itemId, rating, comment, user.getId());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Review>> getItemReviews(@PathVariable Long itemId) {
        return ResponseEntity.ok(reviewService.getItemReviews(itemId));
    }
    
    @GetMapping("/my-reviews")
    public ResponseEntity<List<Review>> getMyReviews(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(reviewService.getUserReviews(user.getId()));
    }
    
    @GetMapping("/can-review/{orderId}/{itemId}")
    public ResponseEntity<Map<String, Boolean>> canReview(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean canReview = reviewService.canReviewItem(orderId, itemId, user.getId());
        Map<String, Boolean> response = new HashMap<>();
        response.put("canReview", canReview);
        return ResponseEntity.ok(response);
    }
}