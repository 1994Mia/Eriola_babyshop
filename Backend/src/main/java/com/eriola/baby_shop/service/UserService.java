package com.eriola.baby_shop.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eriola.baby_shop.entity.User;
import com.eriola.baby_shop.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> registerUser(User user) {
        Map<String, Object> response = new HashMap<>();
        
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }
        
        // In production, hash the password here with BCrypt
        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // Don't send password back
        
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", savedUser);
        return response;
    }
    
    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        User user = userOpt.get();
        
        // In production, verify hashed password with BCrypt
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        
        if (!user.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is deactivated");
            return response;
        }
        
        user.setPassword(null); // Don't send password back
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", user);
        return response;
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        
        return userRepository.save(user);
    }
}