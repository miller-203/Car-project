package com.carrental.controller;

import com.carrental.dto.CarCategoryDTO;
import com.carrental.dto.CarCreateRequest;
import com.carrental.dto.CarDTO;
import com.carrental.dto.SearchRequest;
import com.carrental.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:4200")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        return ResponseEntity.ok(carService.getAllAvailableCars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping("/search")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestBody SearchRequest searchRequest) {
        return ResponseEntity.ok(carService.searchAvailableCars(searchRequest));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CarCategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(carService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarDTO> createCar(@RequestBody CarCreateRequest request) {
        return ResponseEntity.ok(carService.createCar(request));
    }
}
