package org.irtt.nesam.modules.nominee.repository;

import org.irtt.nesam.modules.nominee.domain.model.Nominee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface NomineeRepository extends JpaRepository<Nominee, UUID> {
}
