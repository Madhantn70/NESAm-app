package org.irtt.nesam.data.models.dto;

import org.irtt.nesam.data.models.Types;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionDTO(
        UUID transactionId,
        BigDecimal amount,
        Types.TransactionType type,
        Types.TransactionStatus status,
        LocalDateTime createdAt
) {}
