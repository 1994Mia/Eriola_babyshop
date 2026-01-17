package com.eriola.baby_shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eriola.baby_shop.entity.Cart;
import com.eriola.baby_shop.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    List<Cart> findByUser(User user);
    
Optional<Cart> findByUserAndItemId(User user, Long itemId);    
    void deleteByUser(User user);
}