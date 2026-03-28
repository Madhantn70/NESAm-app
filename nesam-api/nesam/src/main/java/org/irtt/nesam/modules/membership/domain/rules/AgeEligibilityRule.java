package org.irtt.nesam.modules.membership.domain.rules;

import org.irtt.nesam.modules.membership.domain.model.Membership;
import java.time.LocalDate;
import java.time.Period;

public class AgeEligibilityRule {
    public static void check(Membership membership) {
        if (membership.getDob() == null) {
            throw new IllegalArgumentException("DOB is required");
        }
        int age = Period.between(membership.getDob(), LocalDate.now()).getYears();
        if (age < 18) {
            throw new IllegalArgumentException("Member must be at least 18 years old");
        }
    }
}
