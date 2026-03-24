package org.irtt.nesam.services;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.Membership;
import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.models.dto.MembershipDTO;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.MembershipRepository;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipService {

    private final ProfileRepository userRepository;
    private final MembershipRepository membershipRepository;

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String mobileNumber) {
        log.info("Fetching user profile for mobile: {}", mobileNumber);

        return userRepository.findByMobileNumber(mobileNumber)
                .map(user -> new UserProfileDTO(
                        user.getMobileNumber(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getIrttaaId()
                ))
                .orElseThrow(() -> {
                    log.error("User not found for mobile: {}", mobileNumber);
                    return new RuntimeException("User not found");
                });
    }

    @Transactional
    public MembershipDTO createMembership(String mobileNumber, MembershipDTO dto) {
        log.info("Creating membership for user: {}", mobileNumber);

        UserProfile user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User must exist to create membership"));

        Membership membership = new Membership();
        membership.setNesamId(dto.nesamId());
        membership.setUser(user);
        membership.setCurrentStatus(dto.currentStatus());
        membership.setDob(dto.dob());
        membership.setGraduationYear(dto.graduationYear());
        // ... set other fields

        Membership saved = membershipRepository.save(membership);
        log.info("Membership created successfully: {}", saved.getNesamId());

        return new MembershipDTO(
                saved.getNesamId(),
                saved.getCurrentStatus(),
                saved.getDob(),
                saved.getGraduationYear(),
                saved.getSecurityDepositBalance()
        );
    }
}