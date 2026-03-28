package org.irtt.nesam.modules.membership.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.irtt.nesam.modules.membership.domain.rules.MembershipValidator;
import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.membership.dto.request.MembershipRequestDTO;
import org.irtt.nesam.modules.membership.dto.response.MembershipResponseDTO;
import org.irtt.nesam.modules.user.service.UserService;
import org.irtt.nesam.modules.membership.repository.MembershipRepository;
import org.irtt.nesam.modules.membership.mapper.MembershipMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.irtt.nesam.modules.membership.domain.events.MemberRegisteredEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipService {

    private final UserService userService;
    private final MembershipRepository membershipRepository;
    private final MembershipValidator validator;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public MembershipResponseDTO createMembership(String userUuidStr, MembershipRequestDTO dto) {
        log.info("Creating membership for user UUID: {}", userUuidStr);

        java.util.UUID id = java.util.UUID.fromString(userUuidStr);
        UserProfile user = userService.getUserEntityById(id);

        Membership membership = new Membership();
        membership.setNesamId(dto.nesamId());
        membership.setUser(user);
        membership.setCurrentStatus(dto.currentStatus());
        membership.setDob(dto.dob());
        membership.setGender(dto.gender());
        membership.setGraduationYear(dto.graduationYear());
        membership.setMembershipType(dto.membershipType());
        if(dto.securityDepositBalance() != null) {
            membership.setSecurityDepositBalance(dto.securityDepositBalance());
        }

        // Apply domain rules
        validator.validateForCreation(membership);

        Membership saved = membershipRepository.save(membership);
        log.info("Membership created successfully: {}", saved.getNesamId());

        // Publish domain event
        eventPublisher.publishEvent(new MemberRegisteredEvent(saved.getNesamId(), user.getMobileNumber()));

        return MembershipMapper.toResponse(saved);
    }
}