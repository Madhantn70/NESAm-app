package org.irtt.nesam.data.repositories;

import org.irtt.nesam.data.models.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, String> {
    Optional<Membership> findByUser_UserUuid(UUID userUuid);
}
