package org.irtt.nesam.modules.membership.repository;

import org.irtt.nesam.modules.membership.domain.model.NESAmMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NESAmMemberRepository extends JpaRepository<NESAmMember, UUID> {
    Optional<NESAmMember> findByNesamUserId(UUID nesamUserId);
}
