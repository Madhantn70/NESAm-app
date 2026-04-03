package org.irtt.nesam.modules.registration.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AlumniDataDTO {
    private UUID aaAlumniId;
    private String fullName;
    private String email;
    private String mobile;
    private String course;
    private String stream;
    private Integer graduatingYear;
}
