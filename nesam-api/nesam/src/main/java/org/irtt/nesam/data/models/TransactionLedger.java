package org.irtt.nesam.data.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transaction_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionLedger {
    @Id
    @GeneratedValue
    @Column(name = "transaction_id", updatable = false, nullable = false)
    private UUID transactionId;

    @ManyToOne
    @JoinColumn(name = "user_uuid", nullable = false)
    private UserProfile user;

    @ManyToOne
    @JoinColumn(name = "nesam_id", nullable = false)
    private Membership membership;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Types.TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Types.TransactionCategory category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Types.TransactionStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "receipt_url", length = 255)
    private String receiptUrl;
}