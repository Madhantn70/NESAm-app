package org.irtt.nesam.modules.membership.mapper;

import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.irtt.nesam.modules.membership.dto.response.MembershipResponseDTO;

public class MembershipMapper {
    public static MembershipResponseDTO toResponse(Membership membership) {
        if (membership == null) return null;
        return new MembershipResponseDTO(
                membership.getNesamId(),
                membership.getCurrentStatus(),
                membership.getDob(),
                membership.getGraduationYear(),
                membership.getSecurityDepositBalance()
        );
    }
}
