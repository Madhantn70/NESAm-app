package org.irtt.nesam.modules.payment.dto.request;

import org.irtt.nesam.modules.payment.domain.enums.TransactionType;
import org.irtt.nesam.modules.payment.domain.enums.TransactionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionDTO(
        UUID transactionId,
        BigDecimal amount,
        TransactionType type,
        TransactionStatus status,
        LocalDateTime createdAt
) {}
