package org.irtt.nesam.modules.registration.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerifyEmailResponse {
    private boolean exists;
    private String message;
    private AlumniDataDTO alumniData;
}
