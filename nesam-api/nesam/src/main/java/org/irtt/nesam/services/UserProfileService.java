package org.irtt.nesam.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.Membership;
import org.irtt.nesam.data.models.Types;
import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.MembershipRepository;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService implements UserDetailsService {

    private final ProfileRepository profileRepository;
    private final MembershipRepository membershipRepository;

    @Transactional
    public UserProfile registerUser(UserProfileDTO dto) {
        log.info("Registering user: {}", dto.mobileNumber());

        UserProfile user = new UserProfile();
        user.setMobileNumber(dto.mobileNumber());
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setIrttaaId(dto.irttaaId());

        // 1. Save User first
        UserProfile savedUser = profileRepository.save(user);

        // 2. Create and Save Membership
        Membership membership = Membership.builder()
                .nesamId("NESAM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(savedUser)
                .currentStatus(Types.MembershipStatus.PENDING)
                .dob(LocalDate.of(2000, 1, 1))
                .gender(Types.GenderType.OTHER)
                .graduationYear(2000)
                .membershipType(Types.MembershipCategory.REGULAR)
                .isFoundingMember(false)
                .isSeniorExempt(false)
                .securityDepositBalance(BigDecimal.ZERO)
                .enrollmentDate(LocalDate.now())
                .build();

        // Link for the response (but move save/flush earlier)
        membershipRepository.saveAndFlush(membership);

        log.info("User created successfully: {}", savedUser.getMobileNumber());
        
        return savedUser;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // ... (existing code remains or will be updated below)
        UserProfile user = profileRepository.findByMobileNumber(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return User.builder()
                .username(user.getMobileNumber())
                .password("") // Password not used for OTT
                .authorities("USER")
                .build();
    }
}