package org.irtt.nesam.modules.registration.domain.rules;

import org.irtt.nesam.modules.registration.dto.request.NomineeItemRequest;
import org.irtt.nesam.modules.registration.dto.request.RegistrationSubmitRequest;
import org.irtt.nesam.shared.exception.NESAmException;
import org.irtt.nesam.shared.utils.AgeCalculator;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class RegistrationRules {

    public void validateRegistration(RegistrationSubmitRequest request) {
        // [INV-EL-01] Alumni Minimum Age (Assume alumni must be at least 18)
        if (request.getUserInfo().getDateOfBirth() != null) {
            int age = AgeCalculator.calculateCompletedAge(request.getUserInfo().getDateOfBirth(), LocalDate.now());
            if (age < 18) {
                throw new NESAmException("INV-EL-01", "Alumni age cannot be less than 18 years");
            }
            // [INV-EL-02] Entry age < 60 years
            if (age >= 60) {
                throw new NESAmException("INV-EL-02", "Alumni age cannot exceed 60 years at joining");
            }
        }

        // [INV-NM-01] Sum of share percentages must equal 100%
        if (request.getNominees() != null) {
            BigDecimal totalShare = request.getNominees().stream()
                    .map(NomineeItemRequest::getSharePercentage)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalShare.compareTo(new BigDecimal("100.00")) != 0) {
                throw new NESAmException("INV-NM-01", "Nominee share percentage must sum to 100%");
            }
        }
    }
}
