package org.irtt.nesam.modules.membership.dto.request;

import org.irtt.nesam.modules.membership.domain.enums.MembershipCategory;
import org.irtt.nesam.modules.membership.domain.enums.GenderType;
import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;
import java.time.LocalDate;
import java.math.BigDecimal;

public record MembershipRequestDTO(
    String nesamId,
    MembershipStatus currentStatus,
    LocalDate dob,
    GenderType gender,
    Integer graduationYear,
    MembershipCategory membershipType,
    BigDecimal securityDepositBalance
) {}
