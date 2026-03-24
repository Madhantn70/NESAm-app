package org.irtt.nesam.data.models.dto;

import lombok.Builder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO (Using @Builder for easy test object creation)
@Builder
public record UserProfileDTO(
        @NotBlank(message = "Mobile number is required")
        @Size(max = 15)
        String mobileNumber,

        @NotBlank(message = "Full name is required")
        @Size(max = 100)
        String fullName,

        @Email(message = "Invalid email format")
        @Size(max = 100)
        String email,

        String irttaaId
) {}
