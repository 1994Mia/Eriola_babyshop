package com.eriola.baby_shop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eriola.baby_shop.entity.Items;
import com.eriola.baby_shop.repository.ItemsRepository;

@Service
public class ItemsService {
    
    @Autowired
    private ItemsRepository itemsRepository;
    
    public List<Items> getAllItems() {
        return itemsRepository.findAll();
    }
    
    public Optional<Items> getItemById(Long id) {
        return itemsRepository.findById(id);
    }
    
    public Items saveItem(Items item) {
        return itemsRepository.save(item);
    }
    
    public Items updateItem(Long id, Items itemDetails) {
        Items item = itemsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setName(itemDetails.getName());
        item.setDescription(itemDetails.getDescription());
        item.setPrice(itemDetails.getPrice());
        item.setQuantity(itemDetails.getQuantity());
        item.setCategory(itemDetails.getCategory());
        item.setImage(itemDetails.getImage());
        
        return itemsRepository.save(item);
    }
    
    public void deleteItem(Long id) {
        itemsRepository.deleteById(id);
    }
    
    public List<Items> getItemsByCategory(String category) {
        return itemsRepository.findByCategory(category);
    }
}