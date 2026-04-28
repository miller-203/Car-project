package com.carrental.service;

import com.carrental.entity.Reservation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(WhatsAppNotificationService.class);

    @Value("${app.notifications.whatsapp.enabled:false}")
    private boolean whatsappEnabled;

    @Value("${app.notifications.whatsapp.admin-number:212619797080}")
    private String adminPhoneNumber;

    @Value("${app.notifications.whatsapp.phone-number-id:}")
    private String whatsappPhoneNumberId;

    @Value("${app.notifications.whatsapp.access-token:}")
    private String whatsappAccessToken;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendNewReservationNotification(Reservation reservation) {
        if (!whatsappEnabled) {
            logger.info("WhatsApp notification skipped because it is disabled.");
            return;
        }

        if (whatsappPhoneNumberId == null || whatsappPhoneNumberId.isBlank()
                || whatsappAccessToken == null || whatsappAccessToken.isBlank()) {
            logger.warn("WhatsApp notification is enabled but credentials are missing.");
            return;
        }

        String endpoint = "https://graph.facebook.com/v19.0/" + whatsappPhoneNumberId + "/messages";

        Map<String, Object> payload = new HashMap<>();
        payload.put("messaging_product", "whatsapp");
        payload.put("to", normalizePhoneNumber(adminPhoneNumber));
        payload.put("type", "text");
        payload.put("text", Map.of("body", buildReservationMessage(reservation)));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(whatsappAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

        logger.info("WhatsApp notification sent for reservation {}. Status: {}",
                reservation.getReservationNumber(), response.getStatusCode());
    }

    private String normalizePhoneNumber(String phoneNumber) {
        return phoneNumber == null ? "" : phoneNumber.replaceAll("[^0-9]", "");
    }

    private String buildReservationMessage(Reservation reservation) {
        return String.format(
                "New reservation %s by %s %s. Car: %s %s. Pickup: %s %s, Return: %s %s. Phone: %s, Email: %s.",
                reservation.getReservationNumber(),
                reservation.getCustomerFirstName(),
                reservation.getCustomerLastName(),
                reservation.getCar().getName(),
                reservation.getCar().getModel(),
                reservation.getPickupDate(),
                reservation.getPickupTime(),
                reservation.getReturnDate(),
                reservation.getReturnTime(),
                reservation.getCustomerPhone(),
                reservation.getCustomerEmail()
        );
    }
}
