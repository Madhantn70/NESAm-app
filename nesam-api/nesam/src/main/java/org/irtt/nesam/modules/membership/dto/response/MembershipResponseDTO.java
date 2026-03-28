package org.irtt.nesam.modules.membership.dto.response;

import org.irtt.nesam.modules.membership.domain.enums.MembershipCategory;
import org.irtt.nesam.modules.membership.domain.enums.GenderType;
import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;
import java.time.LocalDate;
import java.math.BigDecimal;

public record MembershipResponseDTO(
    String nesamId,
    MembershipStatus currentStatus,
    LocalDate dob,
    Integer graduationYear,
    BigDecimal securityDepositBalance
) {}
