package org.irtt.nesam.modules.membership.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.irtt.nesam.modules.membership.domain.enums.GenderType;
import org.irtt.nesam.modules.membership.domain.enums.MembershipCategory;

import java.time.LocalDate;
import java.util.List;

public record RegistrationRequestDTO(
        @NotBlank @Email String email,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String phoneNumber,
        
        @NotNull LocalDate dateOfBirth,
        @NotNull GenderType gender,
        @NotNull MembershipCategory category,
        @NotNull Integer graduationYear,
        
        @NotEmpty @Valid List<NomineeRequestDTO> nominees,
        
        @NotNull @AssertTrue(message = "Self declaration must be accepted") 
        Boolean selfDeclarationAccepted
) {}
