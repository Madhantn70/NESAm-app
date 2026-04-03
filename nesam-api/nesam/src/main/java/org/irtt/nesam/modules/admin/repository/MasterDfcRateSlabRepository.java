package org.irtt.nesam.modules.admin.repository;

import org.irtt.nesam.modules.admin.domain.model.MasterDfcRateSlab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MasterDfcRateSlabRepository extends JpaRepository<MasterDfcRateSlab, UUID> {
    List<MasterDfcRateSlab> findByIsActiveTrue();

    @org.springframework.data.jpa.repository.Query("SELECT d FROM MasterDfcRateSlab d WHERE d.minAge <= :age AND d.maxAge >= :age AND (d.validTo IS NULL OR d.validTo >= :date) AND d.isActive = true")
    java.util.List<MasterDfcRateSlab> findActiveSlabForAge(@org.springframework.data.repository.query.Param("age") int age, @org.springframework.data.repository.query.Param("date") java.time.LocalDate date);
}
