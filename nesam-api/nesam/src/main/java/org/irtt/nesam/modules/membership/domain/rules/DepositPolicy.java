package org.irtt.nesam.modules.membership.domain.rules;

import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;
import java.math.BigDecimal;

public class DepositPolicy {
    public static final BigDecimal MINIMUM_SECURITY_DEPOSIT = new BigDecimal("1000.00");

    public static void validateInitialDeposit(Membership membership) {
        if (membership.getSecurityDepositBalance().compareTo(MINIMUM_SECURITY_DEPOSIT) < 0) {
            if (membership.getCurrentStatus() == MembershipStatus.ACTIVE) {
               throw new IllegalArgumentException("Active membership requires minimum security deposit of " + MINIMUM_SECURITY_DEPOSIT);
            }
        }
    }
}
