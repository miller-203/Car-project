package com.carrental.dto;

import lombok.Data;

@Data
public class CarCreateRequest {
    private Long categoryId;
    private String name;
    private String model;
    private String exampleModel;
    private Integer year;
    private Integer seats;
    private Integer doors;
    private String transmission;
    private String fuelType;
    private boolean hybrid;
    private boolean hasAirConditioning;
    private String imageUrl;
    private Double payAtAgencyPrice;
    private Double payNowPrice;
    private boolean available = true;
}
