package org.irtt.nesam.modules.registration.dto.response;

import java.math.BigDecimal;

public record SubmitResponse(
    boolean success,
    String membershipNumber,
    String membershipStatus,
    String nesamTier,
    BigDecimal totalPaid,
    String message
) {}
