package org.irtt.nesam.modules.alumni.repository;

import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AaAlumniMasterRepository extends JpaRepository<AaAlumniMaster, UUID> {
    Optional<AaAlumniMaster> findByEmailId(String email);
}
