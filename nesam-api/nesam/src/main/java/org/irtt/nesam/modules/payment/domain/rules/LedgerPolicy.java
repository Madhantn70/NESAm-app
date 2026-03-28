package org.irtt.nesam.modules.payment.domain.rules;

import org.irtt.nesam.modules.payment.domain.model.TransactionLedger;

public class LedgerPolicy {
    public static void validateImmutability(TransactionLedger existing, TransactionLedger updated) {
        if (existing.getTransactionId() != null && updated.getTransactionId() != null) {
            throw new IllegalStateException("Transaction ledger is append-only. Updates are not allowed.");
        }
    }
}
