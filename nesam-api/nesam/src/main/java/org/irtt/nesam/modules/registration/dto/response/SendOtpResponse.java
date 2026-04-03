package org.irtt.nesam.modules.registration.dto.response;

public record SendOtpResponse(
    boolean success,
    String maskedEmail,
    int expiresInSeconds
) {}
