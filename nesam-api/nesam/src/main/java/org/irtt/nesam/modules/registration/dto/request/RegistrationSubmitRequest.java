package org.irtt.nesam.modules.registration.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;
import org.irtt.nesam.modules.user.dto.request.CreateUserRequest;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class RegistrationSubmitRequest {

    @Valid
    private CreateUserRequest userInfo;

    @NotBlank(message = "Membership Type is required")
    private String membershipType;

    @NotEmpty(message = "At least one nominee is required")
    @Valid
    private List<NomineeItemRequest> nominees;

    // Payment details
    private String paymentMode;
    private String trxReferenceNo;
    private String paymentDate; // format: "YYYY-MM-DD"
    private BigDecimal amountPaid;
}
