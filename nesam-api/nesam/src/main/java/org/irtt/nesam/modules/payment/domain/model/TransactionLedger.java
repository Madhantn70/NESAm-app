package org.irtt.nesam.modules.payment.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.membership.domain.model.Membership;
import org.irtt.nesam.modules.payment.domain.enums.TransactionType;
import org.irtt.nesam.modules.payment.domain.enums.TransactionCategory;
import org.irtt.nesam.modules.payment.domain.enums.TransactionStatus;

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
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionCategory category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "receipt_url", length = 255)
    private String receiptUrl;
}