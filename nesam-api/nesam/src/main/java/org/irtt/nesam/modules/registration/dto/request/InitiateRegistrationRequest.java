package org.irtt.nesam.modules.registration.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InitiateRegistrationRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    String email
) {}
