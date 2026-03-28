package org.irtt.nesam.modules.user.mapper;

import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.user.dto.response.UserProfileResponseDTO;

public class UserMapper {
    public static UserProfileResponseDTO toResponse(UserProfile user) {
        if(user == null) return null;
        return new UserProfileResponseDTO(
                user.getMobileNumber(),
                user.getFullName(),
                user.getEmail(),
                user.getIrttaaId()
        );
    }
}
