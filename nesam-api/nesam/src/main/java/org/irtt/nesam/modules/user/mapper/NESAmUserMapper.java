package org.irtt.nesam.modules.user.mapper;

import org.irtt.nesam.modules.user.domain.model.NESAmUser;
import org.irtt.nesam.modules.user.dto.response.UserSummaryResponse;

public class NESAmUserMapper {
    public static UserSummaryResponse toSummary(NESAmUser user) {
        if (user == null) {
            return null;
        }
        return UserSummaryResponse.builder()
                .nesamUserId(user.getNesamUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .department(user.getDepartment())
                .graduatingYear(user.getGraduatingYear())
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .build();
    }
}
