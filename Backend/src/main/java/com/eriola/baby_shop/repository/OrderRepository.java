package com.eriola.baby_shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eriola.baby_shop.entity.Orders;
import com.eriola.baby_shop.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    
    List<Orders> findByUser(User user);
    
    List<Orders> findByStatus(String status);
}
