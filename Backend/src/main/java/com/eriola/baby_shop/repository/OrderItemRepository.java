package com.eriola.baby_shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eriola.baby_shop.entity.OrderItem;
import com.eriola.baby_shop.entity.Orders;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrder(Orders order);
}