package org.irtt.nesam.modules.membership.repository;

import org.irtt.nesam.modules.membership.domain.model.MemberNominee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MemberNomineeRepository extends JpaRepository<MemberNominee, UUID> {
    List<MemberNominee> findByNesamMemberId(UUID nesamMemberId);
}
