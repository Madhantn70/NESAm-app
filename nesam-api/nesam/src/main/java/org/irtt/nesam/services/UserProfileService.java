package org.irtt.nesam.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserProfileService implements UserDetailsService {

    private final ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserProfile user = profileRepository.findByMobileNumber(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.builder()
                .username(user.getMobileNumber()) // ✅ JWT subject = mobile
                .authorities("USER")
                .build();
    }
}