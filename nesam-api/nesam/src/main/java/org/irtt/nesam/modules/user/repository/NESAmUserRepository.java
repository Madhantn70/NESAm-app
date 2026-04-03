package org.irtt.nesam.modules.user.repository;

import org.irtt.nesam.modules.user.domain.model.NESAmUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NESAmUserRepository extends JpaRepository<NESAmUser, UUID> {
    Optional<NESAmUser> findByEmail(String email);
}
