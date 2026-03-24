package org.irtt.nesam.data.repositories;

import org.irtt.nesam.data.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<UserProfile, UUID> {
    Optional<UserProfile> findByMobileNumber(String mobileNumber);
}