package org.irtt.nesam.modules.user.service;

import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.user.dto.request.UserProfileRequestDTO;
import org.irtt.nesam.modules.user.dto.response.UserProfileResponseDTO;
import org.irtt.nesam.modules.user.repository.UserRepository;
import org.irtt.nesam.modules.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import lombok.RequiredArgsConstructor;
import java.util.Collections;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repository;


    @Transactional
    public UserProfileResponseDTO createUser(UserProfileRequestDTO dto) {
        if (repository.findByMobileNumber(dto.mobileNumber()).isPresent()) {
            throw new RuntimeException("Mobile number already registered");
        }

        UserProfile entity = new UserProfile();
        entity.setMobileNumber(dto.mobileNumber());
        entity.setFullName(dto.fullName());
        entity.setEmail(dto.email());
        entity.setIrttaaId(dto.irttaaId());

        UserProfile saved = repository.save(entity);
        return UserMapper.toResponse(saved);
    }

    public UserProfileResponseDTO getUserById(UUID id) {
        return repository.findById(id)
                .map(UserMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileResponseDTO getUserByMobileNumber(String mobile) {
        return repository.findByMobileNumber(mobile)
                .map(UserMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserProfileResponseDTO> getAllUsers() {
        return repository.findAll().stream().map(UserMapper::toResponse).collect(Collectors.toList());
    }

    public UserProfile getUserEntityByMobileNumber(String mobile) {
        return repository.findByMobileNumber(mobile)
                 .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfile getUserEntityById(UUID id) {
        return repository.findById(id)
                 .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfile getUserEntityByEmail(String email) {
        return repository.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserProfile user = repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                "",
                Collections.emptyList()
        );
    }
}