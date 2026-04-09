package com.carrental.service;

import com.carrental.dto.CarCategoryDTO;
import com.carrental.dto.CarCreateRequest;
import com.carrental.dto.CarDTO;
import com.carrental.dto.SearchRequest;
import com.carrental.entity.Car;
import com.carrental.entity.CarCategory;
import com.carrental.repository.CarCategoryRepository;
import com.carrental.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarCategoryRepository carCategoryRepository;

    public List<CarDTO> getAllAvailableCars() {
        return carRepository.findByAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CarDTO> searchAvailableCars(SearchRequest searchRequest) {
        List<Car> availableCars = carRepository.findAvailableCars(
            searchRequest.getPickupDate(),
            searchRequest.getReturnDate()
        );

        return availableCars.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        return convertToDTO(car);
    }

    public List<CarCategoryDTO> getAllCategories() {
        return carCategoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::convertCategoryToDTO)
                .collect(Collectors.toList());
    }

    public CarDTO createCar(CarCreateRequest request) {
        CarCategory category = carCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Car car = new Car();
        car.setCategory(category);
        car.setName(request.getName());
        car.setModel(request.getModel());
        car.setExampleModel(request.getExampleModel());
        car.setYear(request.getYear());
        car.setSeats(request.getSeats());
        car.setDoors(request.getDoors());
        car.setTransmission(request.getTransmission());
        car.setFuelType(request.getFuelType());
        car.setHybrid(request.isHybrid());
        car.setHasAirConditioning(request.isHasAirConditioning());
        car.setImageUrl(request.getImageUrl());
        car.setPayAtAgencyPrice(request.getPayAtAgencyPrice());
        car.setPayNowPrice(request.getPayNowPrice());
        car.setAvailable(request.isAvailable());

        return convertToDTO(carRepository.save(car));
    }

    private CarDTO convertToDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setName(car.getName());
        dto.setModel(car.getModel());
        dto.setExampleModel(car.getExampleModel());
        dto.setYear(car.getYear());
        dto.setSeats(car.getSeats());
        dto.setDoors(car.getDoors());
        dto.setTransmission(car.getTransmission());
        dto.setFuelType(car.getFuelType());
        dto.setHybrid(car.isHybrid());
        dto.setHasAirConditioning(car.isHasAirConditioning());
        dto.setImageUrl(car.getImageUrl());
        dto.setPayAtAgencyPrice(car.getPayAtAgencyPrice());
        dto.setPayNowPrice(car.getPayNowPrice());
        dto.setSavings(car.getPayAtAgencyPrice() - car.getPayNowPrice());
        dto.setCategory(convertCategoryToDTO(car.getCategory()));
        return dto;
    }

    private CarCategoryDTO convertCategoryToDTO(CarCategory category) {
        CarCategoryDTO dto = new CarCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setNameFr(category.getNameFr());
        dto.setDescription(category.getDescription());
        dto.setDisplayOrder(category.getDisplayOrder());
        return dto;
    }
}
