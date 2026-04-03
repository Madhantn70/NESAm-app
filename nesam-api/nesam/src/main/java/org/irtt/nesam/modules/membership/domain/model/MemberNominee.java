package org.irtt.nesam.modules.membership.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nesam_member_nominees")
@Getter
@Setter
public class MemberNominee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nominee_id", updatable = false, nullable = false)
    private UUID nomineeId;

    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nesam_membership_id", nullable = false)
    private UUID nesamMemberId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String nomineeName;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "relationship")
    private NomineeRelationship relationship;
    @Column(name = "percent_share", precision = 5, scale = 2)
    private BigDecimal sharePercentage;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "active")
    private Boolean active = true;
}
