package org.irtt.nesam.modules.registration.repository;

import org.irtt.nesam.modules.registration.domain.model.NESAmApplication;
import org.irtt.nesam.modules.registration.domain.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NESAmApplicationRepository extends JpaRepository<NESAmApplication, UUID> {
    Optional<NESAmApplication> findFirstByEmailIdAndStatusOrderByStartedAtDesc(String emailId, ApplicationStatus status);
}
