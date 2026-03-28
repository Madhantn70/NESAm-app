package org.irtt.nesam.modules.user.repository;

import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserProfile, UUID> {
    Optional<UserProfile> findByMobileNumber(String mobileNumber);
    Optional<UserProfile> findByEmail(String email);
}