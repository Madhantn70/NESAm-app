package org.irtt.nesam.modules.membership.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record NomineeRequestDTO(
        @NotBlank String name,
        @NotBlank String relationship,
        @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal percentage,
        @NotNull LocalDate dateOfBirth
) {}
