package org.irtt.nesam.modules.membership.service;

import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.user.service.UserService;
import org.irtt.nesam.modules.membership.domain.enums.MembershipCategory;
import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;
import org.irtt.nesam.modules.membership.domain.enums.GenderType;
import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.irtt.nesam.modules.membership.dto.request.MembershipRequestDTO;
import org.irtt.nesam.modules.membership.dto.response.MembershipResponseDTO;
import org.irtt.nesam.modules.membership.repository.MembershipRepository;
import org.irtt.nesam.modules.membership.domain.rules.MembershipValidator;
import org.springframework.context.ApplicationEventPublisher;
import org.irtt.nesam.modules.membership.domain.events.MemberRegisteredEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MembershipServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private MembershipValidator validator;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private MembershipService membershipService;

    @Test
    void shouldCreateMembership() {
        UserProfile user = new UserProfile();
        user.setMobileNumber("9876543210");

        when(userService.getUserEntityByMobileNumber("9876543210")).thenReturn(user);

        MembershipRequestDTO requestDTO = new MembershipRequestDTO(
            "NESAM123", MembershipStatus.PENDING, LocalDate.of(1990, 1, 1),
            GenderType.MALE, 2012, MembershipCategory.REGULAR, new BigDecimal("1000.00")
        );

        Membership saved = new Membership();
        saved.setNesamId("NESAM123");
        saved.setCurrentStatus(MembershipStatus.PENDING);
        saved.setDob(LocalDate.of(1990, 1, 1));
        saved.setSecurityDepositBalance(new BigDecimal("1000.00"));

        when(membershipRepository.save(any(Membership.class))).thenReturn(saved);

        MembershipResponseDTO response = membershipService.createMembership("9876543210", requestDTO);

        assertThat(response.nesamId()).isEqualTo("NESAM123");
        verify(eventPublisher, times(1)).publishEvent(any(MemberRegisteredEvent.class));
    }
}