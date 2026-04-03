package org.irtt.nesam.modules.registration.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RegistrationSubmitResponse {
    private UUID applicationId;
    private String status;
    private String message;
}
