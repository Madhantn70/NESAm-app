package org.irtt.nesam.services;

import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MembershipServiceTest {

    @Mock
    private ProfileRepository userRepository;

    @InjectMocks
    private MembershipService membershipService;

    @Test
    void shouldReturnUserProfileDTO() {

        UUID uuid = UUID.randomUUID();
        UserProfile user = new UserProfile();
        user.setUserUuid(uuid);
        user.setMobileNumber("9876543210");
        user.setFullName("Jane Doe");

        when(userRepository.findByMobileNumber("9876543210"))
                .thenReturn(Optional.of(user));

        UserProfileDTO result = membershipService.getUserProfile("9876543210");

        assertThat(result.fullName()).isEqualTo("Jane Doe");
        verify(userRepository, times(1)).findByMobileNumber(anyString());
    }
}