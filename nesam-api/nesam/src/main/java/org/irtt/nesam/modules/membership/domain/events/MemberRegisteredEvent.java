package org.irtt.nesam.modules.membership.domain.events;

import org.irtt.nesam.shared.events.DomainEvent;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class MemberRegisteredEvent implements DomainEvent {
    private final String nesamId;
    private final String mobileNumber;
    private final LocalDateTime registeredAt = LocalDateTime.now();
}
