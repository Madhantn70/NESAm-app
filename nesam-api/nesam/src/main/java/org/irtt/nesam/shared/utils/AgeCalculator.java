package org.irtt.nesam.shared.utils;

import java.time.LocalDate;
import java.time.Period;

public final class AgeCalculator {

    private AgeCalculator() {}

    public static int calculateCompletedAge(LocalDate dob, LocalDate asOfDate) {
        if (dob == null || asOfDate == null) {
            throw new IllegalArgumentException("DOB and AsOfDate must not be null");
        }
        if (asOfDate.isBefore(dob)) {
            throw new IllegalArgumentException("asOfDate must not be before dob");
        }
        return Period.between(dob, asOfDate).getYears();
    }
}
