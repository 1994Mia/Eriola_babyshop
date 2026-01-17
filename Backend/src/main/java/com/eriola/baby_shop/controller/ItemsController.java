package com.eriola.baby_shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eriola.baby_shop.entity.Items;
import com.eriola.baby_shop.repository.ItemsRepository;
import com.eriola.baby_shop.service.ItemsService;


@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemsController {
    
    @Autowired
    private ItemsService itemsService;
    private ItemsRepository itemsRepository;
    
    @GetMapping
    public ResponseEntity<List<Items>> getAllItems() {
        return ResponseEntity.ok(itemsService.getAllItems());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Items> getItemById(@PathVariable Long id) {
        return itemsService.getItemById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Items> createItem(@RequestBody Items item) {
        Items savedItem = itemsService.saveItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Items> updateItem(@PathVariable Long id, @RequestBody Items item) {
        try {
            Items updatedItem = itemsService.updateItem(id, item);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemsService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/most-reviewed")
public ResponseEntity<List<Items>> getMostReviewedItems() {
    Pageable pageable = PageRequest.of(0, 3); // Top 3 most reviewed
    return ResponseEntity.ok(itemsRepository.findMostReviewedItems(pageable));
}
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Items>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(itemsService.getItemsByCategory(category));
    }
}