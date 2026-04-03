package org.irtt.nesam.data.repositories;

import org.irtt.nesam.data.models.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, UUID> {
    Optional<Alumni> findByEmail(String email);
}
