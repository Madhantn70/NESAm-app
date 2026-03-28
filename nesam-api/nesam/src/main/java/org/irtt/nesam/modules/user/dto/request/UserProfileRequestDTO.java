package org.irtt.nesam.modules.user.dto.request;

import lombok.Builder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Builder
public record UserProfileRequestDTO(
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
