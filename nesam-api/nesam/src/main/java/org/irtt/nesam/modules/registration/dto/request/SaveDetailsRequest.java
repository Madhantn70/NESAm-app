package org.irtt.nesam.modules.registration.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import org.jspecify.annotations.Nullable;
import java.time.LocalDate;
import java.util.UUID;

public record SaveDetailsRequest(
    @Nullable UUID applicationId,
    @Nullable @Pattern(regexp = "^[6-9]\\d{9}$", message = "Must be a valid 10-digit Indian mobile number") String mobile,
    @Nullable String line1,
    @Nullable String line2,
    @Nullable String city,
    @Nullable String state,
    @Nullable String postalCode,
    @Nullable String country,
    @Nullable LocalDate dateOfBirth,
    @Nullable String gender,
    @Nullable String nomineeName,
    @Nullable String nomineeRelationship,
    @Nullable @Email String nomineeEmail,
    @Nullable String nomineeMobile
) {}
