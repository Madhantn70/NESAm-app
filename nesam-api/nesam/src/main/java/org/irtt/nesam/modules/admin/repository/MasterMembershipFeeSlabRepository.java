package org.irtt.nesam.modules.admin.repository;

import org.irtt.nesam.modules.admin.domain.model.MasterMembershipFeeSlab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MasterMembershipFeeSlabRepository extends JpaRepository<MasterMembershipFeeSlab, UUID> {

    @org.springframework.data.jpa.repository.Query("SELECT f FROM MasterMembershipFeeSlab f WHERE f.minAge <= :age AND f.maxAge >= :age AND (f.validTo IS NULL OR f.validTo >= :date) AND f.isActive = true")
    java.util.List<MasterMembershipFeeSlab> findActiveSlabForAge(@org.springframework.data.repository.query.Param("age") int age, @org.springframework.data.repository.query.Param("date") java.time.LocalDate date);
}
