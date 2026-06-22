package org.irtt.nesam.data.models.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {
    private String email;
    private ContactData contactData;
    private AgeData ageData;
    private List<NomineeData> nominees;
    private String membershipType;
    private Boolean selfDeclarationAccepted;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactData {
        private String fullName;
        private String mobile;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pinCode;
        private String country;
        private String branch;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgeData {
        private LocalDate dateOfBirth;
        private String gender;
        private Integer graduationYear;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NomineeData {
        private String name;
        private String relationship;
        private LocalDate dob;
        private Double percentageShare;
        private String mobile;
        private String email;
    }
}
