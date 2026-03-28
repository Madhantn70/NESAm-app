package org.irtt.nesam.modules.membership.domain.rules;

import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;

public class StatusTransitionRule {
    public static void validateTransition(MembershipStatus current, MembershipStatus next) {
        if (current == MembershipStatus.LAPSED) {
            throw new IllegalStateException("LAPSED membership cannot be reactivated");
        }
        if (current == MembershipStatus.DECEASED) {
            throw new IllegalStateException("DECEASED membership cannot change status");
        }
    }
}
