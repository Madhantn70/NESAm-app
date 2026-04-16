package org.irtt.nesam.data.repositories;

import org.irtt.nesam.data.models.TransactionLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionLedgerRepository extends JpaRepository<TransactionLedger, UUID> {
    
}
