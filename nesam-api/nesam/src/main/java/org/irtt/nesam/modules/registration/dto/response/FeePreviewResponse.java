package org.irtt.nesam.modules.registration.dto.response;

import java.math.BigDecimal;

public record FeePreviewResponse(
    int completedAge,
    String ageSlab,
    BigDecimal baseMembershipFee,
    BigDecimal discountPercent,
    BigDecimal discountAmount,
    BigDecimal finalMembershipFee,
    BigDecimal dfcPerEvent,
    int advanceDfcMultiplier,
    BigDecimal advanceDfc,
    BigDecimal totalPayable,
    String tierApplied,
    String slabSource
) {}
