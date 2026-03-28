package org.irtt.nesam.modules.user.dto.response;

import lombok.Builder;

@Builder
public record UserProfileResponseDTO(
        String mobileNumber,
        String fullName,
        String email,
        String irttaaId
) {}
