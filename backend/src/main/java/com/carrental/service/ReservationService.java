package com.carrental.service;

import com.carrental.dto.*;
import com.carrental.entity.*;
import com.carrental.repository.*;
import com.carrental.security.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WhatsAppNotificationService whatsAppNotificationService;

    public List<ReservationResponse> getUserReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse getReservationByNumber(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return convertToResponse(reservation);
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new RuntimeException("User must be logged in to create a reservation");
        }

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Agency pickupAgency = agencyRepository.findById(request.getPickupAgencyId())
                .orElseThrow(() -> new RuntimeException("Pickup agency not found"));

        Agency returnAgency = request.getReturnAgencyId() != null ?
            agencyRepository.findById(request.getReturnAgencyId())
                .orElseThrow(() -> new RuntimeException("Return agency not found")) : pickupAgency;

        long days = ChronoUnit.DAYS.between(request.getPickupDate(), request.getReturnDate());
        if (days < 1) days = 1;

        Double pricePerDay = "PAY_NOW".equals(request.getPaymentType()) ?
            car.getPayNowPrice() : car.getPayAtAgencyPrice();

        Double totalPrice = pricePerDay * days;
        Double discountAmount = 0.0;

        if (request.getDiscountCode() != null && !request.getDiscountCode().isEmpty()) {
            discountAmount = totalPrice * 0.10;
            totalPrice -= discountAmount;
        }

        Reservation reservation = new Reservation();
        reservation.setReservationNumber(generateReservationNumber());
        reservation.setUser(user);
        reservation.setCar(car);
        reservation.setPickupAgency(pickupAgency);
        reservation.setReturnAgency(returnAgency);
        reservation.setPickupDate(request.getPickupDate());
        reservation.setPickupTime(request.getPickupTime());
        reservation.setReturnDate(request.getReturnDate());
        reservation.setReturnTime(request.getReturnTime());
        reservation.setTotalPrice(totalPrice);
        reservation.setPaymentType(request.getPaymentType());
        reservation.setDiscountCode(request.getDiscountCode());
        reservation.setDiscountAmount(discountAmount);
        reservation.setDriverAge25Plus(request.isDriverAge25Plus());
        reservation.setCustomerFirstName(request.getCustomerFirstName());
        reservation.setCustomerLastName(request.getCustomerLastName());
        reservation.setCustomerEmail(request.getCustomerEmail());
        reservation.setCustomerPhone(request.getCustomerPhone());
        reservation.setStatus("CONFIRMED");

        reservationRepository.save(reservation);
        try {
            whatsAppNotificationService.sendNewReservationNotification(reservation);
        } catch (Exception ex) {
            logger.warn("Failed to send WhatsApp notification for reservation {}: {}",
                    reservation.getReservationNumber(), ex.getMessage());
        }

        return convertToResponse(reservation);
    }

    private String generateReservationNumber() {
        return "AV" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private ReservationResponse convertToResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setReservationNumber(reservation.getReservationNumber());
        response.setCar(convertCarToDTO(reservation.getCar()));
        response.setPickupAgency(convertAgencyToDTO(reservation.getPickupAgency()));
        response.setReturnAgency(convertAgencyToDTO(reservation.getReturnAgency()));
        response.setPickupDate(reservation.getPickupDate());
        response.setPickupTime(reservation.getPickupTime());
        response.setReturnDate(reservation.getReturnDate());
        response.setReturnTime(reservation.getReturnTime());
        response.setTotalPrice(reservation.getTotalPrice());
        response.setPaymentType(reservation.getPaymentType());
        response.setStatus(reservation.getStatus());
        response.setCreatedAt(reservation.getCreatedAt());
        response.setCustomerFirstName(reservation.getCustomerFirstName());
        response.setCustomerLastName(reservation.getCustomerLastName());
        response.setCustomerEmail(reservation.getCustomerEmail());
        response.setCustomerPhone(reservation.getCustomerPhone());
        return response;
    }

    private CarDTO convertCarToDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setName(car.getName());
        dto.setModel(car.getModel());
        dto.setExampleModel(car.getExampleModel());
        dto.setSeats(car.getSeats());
        dto.setDoors(car.getDoors());
        dto.setTransmission(car.getTransmission());
        dto.setImageUrl(car.getImageUrl());
        dto.setPayAtAgencyPrice(car.getPayAtAgencyPrice());
        dto.setPayNowPrice(car.getPayNowPrice());
        return dto;
    }

    private AgencyDTO convertAgencyToDTO(Agency agency) {
        AgencyDTO dto = new AgencyDTO();
        dto.setId(agency.getId());
        dto.setName(agency.getName());
        dto.setCity(agency.getCity());
        dto.setAddress(agency.getAddress());
        dto.setAirport(agency.isAirport());
        dto.setAirportCode(agency.getAirportCode());
        return dto;
    }
}
