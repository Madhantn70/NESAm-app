package org.irtt.nesam.modules.registration.dto.request;

import jakarta.validation.constraints.*;
import java.util.UUID;

public record SubmitApplicationRequest(
    @NotNull(message = "Application ID is required") UUID applicationId,
    @AssertTrue(message = "Self declaration must be accepted") boolean selfDeclarationAccepted,
    String paymentReference
) {}
