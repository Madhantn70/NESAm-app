package org.irtt.nesam.modules.membership.domain.rules;

import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.springframework.stereotype.Component;

@Component
public class MembershipValidator {
    public void validateForCreation(Membership membership) {
        if (membership == null) throw new IllegalArgumentException("Membership cannot be null");
        AgeEligibilityRule.check(membership);
    }
}
