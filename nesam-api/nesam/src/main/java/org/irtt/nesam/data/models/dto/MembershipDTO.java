package org.irtt.nesam.data.models.dto;

import org.irtt.nesam.data.models.Types;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MembershipDTO(
        String nesamId,
        Types.MembershipStatus currentStatus,
        LocalDate dob,
        Integer graduationYear,
        BigDecimal securityDepositBalance
) {}
