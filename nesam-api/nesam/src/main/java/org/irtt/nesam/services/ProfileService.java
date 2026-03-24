package org.irtt.nesam.services;

import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository repository;

    public ProfileService(ProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UserProfileDTO createUser(UserProfileDTO dto) {
        // Check if mobile number already exists
        if (repository.findByMobileNumber(dto.mobileNumber()).isPresent()) {
            throw new RuntimeException("Mobile number already registered");
        }

        UserProfile entity = new UserProfile();
        entity.setMobileNumber(dto.mobileNumber());
        entity.setFullName(dto.fullName());
        entity.setEmail(dto.email());
        entity.setIrttaaId(dto.irttaaId());

        UserProfile saved = repository.save(entity);
        return mapToDTO(saved);
    }

    public UserProfileDTO getUserById(UUID id) {
        return repository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserProfileDTO mapToDTO(UserProfile entity) {
        return new UserProfileDTO(
                entity.getMobileNumber(),
                entity.getFullName(),
                entity.getEmail(),
                entity.getIrttaaId()
        );
    }
}