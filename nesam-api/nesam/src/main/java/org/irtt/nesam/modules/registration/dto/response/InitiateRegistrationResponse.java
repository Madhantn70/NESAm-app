package org.irtt.nesam.modules.registration.dto.response;

import org.irtt.nesam.modules.registration.domain.model.RegistrationStatus;
import org.jspecify.annotations.Nullable;

import java.time.Instant;
import java.util.UUID;

public record InitiateRegistrationResponse(
    RegistrationStatus status,
    @Nullable UUID pendingApplicationId,
    @Nullable Instant pendingApplicationStartedAt,
    String message
) {}
