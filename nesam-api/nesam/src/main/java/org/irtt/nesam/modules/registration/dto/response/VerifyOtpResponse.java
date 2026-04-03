package org.irtt.nesam.modules.registration.dto.response;

import org.jspecify.annotations.Nullable;

import java.util.UUID;

public record VerifyOtpResponse(
    String token,
    String email,
    String applicationStatus,
    @Nullable UUID pendingApplicationId
) {}
