package org.irtt.nesam.modules.registration.repository;

import org.irtt.nesam.modules.registration.domain.model.NESAmApplicationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NESAmApplicationDetailRepository extends JpaRepository<NESAmApplicationDetail, UUID> {
}
