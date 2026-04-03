package org.irtt.nesam.modules.user.dto.request;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class CreateUserRequest {
    private String email;
    private UUID aaAlumniId;
    private String fullName;
    private String mobile;
    private Integer graduatingYear;
    private String department;
    private String gender;
    private LocalDate dateOfBirth;

    // Address
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
