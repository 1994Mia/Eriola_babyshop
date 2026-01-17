package com.eriola.baby_shop.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.eriola.baby_shop.config.JwtUtil;
import com.eriola.baby_shop.entity.User;
import com.eriola.baby_shop.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Map<String, Object> registerUser(User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return response;
            }
            
            // Hash password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Set default values
            if (user.getRole() == null) {
                user.setRole(User.Role.CUSTOMER);
            }
            if (user.getIsActive() == null) {
                user.setIsActive(true);
            }
            if (user.getIsAdmin() == null) {
                user.setIsAdmin(user.getRole() == User.Role.ADMIN);
            }
            
            // Save user
            User savedUser = userRepository.save(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(
                savedUser.getEmail(), 
                savedUser.getId(), 
                savedUser.getRole().toString()
            );
            
            savedUser.setPassword(null);
            
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("user", savedUser);
            response.put("token", token);
            
        } catch (Exception e) {
            e.printStackTrace(); // This will show in console
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return response;
            }
            
            User user = userOpt.get();
            
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return response;
            }
            
            if (user.getIsActive() != null && !user.getIsActive()) {
                response.put("success", false);
                response.put("message", "Account is deactivated");
                return response;
            }
            
            // Generate JWT token
            String token = jwtUtil.generateToken(
                user.getEmail(), 
                user.getId(), 
                user.getRole().toString()
            );
            
            user.setPassword(null);
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", user);
            response.put("token", token);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
        }
        
        return response;
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDetails.getFirstName() != null) {
            user.setFirstName(userDetails.getFirstName());
        }
        if (userDetails.getLastName() != null) {
            user.setLastName(userDetails.getLastName());
        }
        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }
        
        return userRepository.save(user);
    }
}