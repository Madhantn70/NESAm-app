package org.irtt.nesam.modules.registration.dto.response;

import java.time.Instant;
import java.util.UUID;

public record SaveDetailsResponse(
    UUID applicationId,
    String status,
    Instant savedAt
) {}
