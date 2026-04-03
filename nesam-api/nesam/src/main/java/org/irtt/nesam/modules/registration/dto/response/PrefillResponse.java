package org.irtt.nesam.modules.registration.dto.response;

import org.jspecify.annotations.Nullable;

import java.time.LocalDate;
import java.util.UUID;

public record PrefillResponse(
    String source,
    @Nullable UUID applicationId,
    AlumniInfo alumni,
    @Nullable SavedContact savedContact,
    @Nullable LocalDate savedDateOfBirth,
    @Nullable String savedGender,
    @Nullable SavedNominee savedNominee
) {
    public record AlumniInfo(
        String fullName,
        String email,
        Integer graduatingYear,
        String department,
        boolean isPatron,
        boolean isFounding
    ) {}

    public record SavedContact(
        String mobile,
        String line1, String line2,
        String city, String state,
        String postalCode, String country
    ) {}

    public record SavedNominee(
        String nomineeName,
        String nomineeRelationship,
        String nomineeEmail,
        String nomineeMobile
    ) {}
}
