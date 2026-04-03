package org.irtt.nesam.modules.registration.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class NomineeItemRequest {

    @NotBlank(message = "Nominee name is required")
    private String name;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    @NotBlank(message = "DOB (YYYY-MM-DD) is required")
    private String dob;

    // Optional for adults, mandatory for minors <18
    private String guardianName;
    private String guardianRelationship;

    @NotNull(message = "Share percentage is required")
    @DecimalMin(value = "0.01", message = "Share must be > 0.01")
    @DecimalMax(value = "100.00", message = "Share must not exceed 100")
    private BigDecimal sharePercentage;
}
