package org.irtt.nesam.modules.membership.dto.response;

import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;

public record RegistrationResponseDTO(
        String nesamId,
        MembershipStatus membershipStatus
) {}
