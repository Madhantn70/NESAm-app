package org.irtt.nesam.modules.membership.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nesam_members")
@Getter
@Setter
public class NESAmMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nesam_membership_id", updatable = false, nullable = false)
    private UUID nesamMemberId;

    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nesam_user_id", nullable = false)
    private UUID nesamUserId;

    @Column(name = "membership_number", unique = true, length = 50)
    private String nesamId;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "nesam_tier", nullable = false)
    private MembershipTier membershipType;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "membership_status", nullable = false)
    private MembershipStatus status = MembershipStatus.ACTIVE;

    @Column(name = "enrollment_date")
    private LocalDate joinedDate;

    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "application_id", nullable = false, unique = true)
    private UUID applicationId;

    @Column(name = "activation_date")
    private LocalDate activationDate;

    @Column(name = "lapsed_date")
    private LocalDate lapsedDate;
}
