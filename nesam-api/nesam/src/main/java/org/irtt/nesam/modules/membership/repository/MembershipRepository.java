package org.irtt.nesam.modules.membership.repository;

import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, String> {
}
