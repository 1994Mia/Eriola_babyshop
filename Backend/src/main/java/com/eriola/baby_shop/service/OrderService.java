package com.eriola.baby_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eriola.baby_shop.entity.Cart;
import com.eriola.baby_shop.entity.OrderItem;
import com.eriola.baby_shop.entity.Orders;
import com.eriola.baby_shop.entity.User;
import com.eriola.baby_shop.repository.CartRepository;
import com.eriola.baby_shop.repository.OrderItemRepository;
import com.eriola.baby_shop.repository.OrderRepository;
import com.eriola.baby_shop.repository.UserRepository;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public Orders createOrder(Long userId, String shippingAddress, String phone) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Cart> cartItems = cartRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total
        double totalAmount = cartItems.stream()
            .mapToDouble(cart -> cart.getItem().getPrice() * cart.getQuantity())
            .sum();
        
        // Create order
        Orders order = new Orders();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(shippingAddress);
        order.setPhone(phone);
        order.setStatus("PENDING");
        
        Orders savedOrder = orderRepository.save(order);
        
        // Create order items from cart
        for (Cart cart : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setItem(cart.getItem());
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(cart.getItem().getPrice());
            orderItemRepository.save(orderItem);
        }
        
        // Clear cart after order
        cartRepository.deleteByUser(user);
        
        return savedOrder;
    }
    
    public List<Orders> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }
    
    public Orders getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    public List<OrderItem> getOrderItems(Long orderId) {
        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderItemRepository.findByOrder(order);
    }
    
    public List<Orders> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Orders updateOrderStatus(Long orderId, String status) {
        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}