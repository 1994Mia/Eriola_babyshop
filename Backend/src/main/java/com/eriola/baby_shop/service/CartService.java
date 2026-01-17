package com.eriola.baby_shop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eriola.baby_shop.entity.Cart;
import com.eriola.baby_shop.entity.Items;
import com.eriola.baby_shop.entity.User;
import com.eriola.baby_shop.repository.CartRepository;
import com.eriola.baby_shop.repository.ItemsRepository;
import com.eriola.baby_shop.repository.UserRepository;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ItemsRepository itemsRepository;
    
    public List<Cart> getUserCart(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user);
    }
    
    public Cart addToCart(Long userId, Long itemId, Integer quantity) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Items item = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Check if item already in cart
             Optional<Cart> existingCart = cartRepository.findByUserAndItemId(user, itemId);

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + quantity);
            return cartRepository.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setItem(item);
            cart.setQuantity(quantity);
            return cartRepository.save(cart);
        }
    }
    
    public Cart updateCartItem(Long cartId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }
    
    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepository.deleteByUser(user);
    }
}
