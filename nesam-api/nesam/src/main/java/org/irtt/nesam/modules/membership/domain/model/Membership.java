package org.irtt.nesam.modules.membership.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.membership.domain.enums.MembershipStatus;
import org.irtt.nesam.modules.membership.domain.enums.MembershipCategory;
import org.irtt.nesam.modules.membership.domain.enums.GenderType;
import org.irtt.nesam.modules.nominee.domain.model.Nominee;

@Entity
@Table(name = "memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership {
    @Id
    @Column(name = "nesam_id", length = 20)
    private String nesamId;

    @OneToOne
    @JoinColumn(name = "user_uuid", nullable = false)
    private UserProfile user;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    private MembershipStatus currentStatus = MembershipStatus.PENDING;

    @Column(nullable = false)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenderType gender;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "membership_type", nullable = false)
    private MembershipCategory membershipType;

    @Builder.Default
    @Column(name = "is_founding_member", nullable = false)
    private Boolean isFoundingMember = false;

    @Builder.Default
    @Column(name = "is_senior_exempt")
    private Boolean isSeniorExempt = false;

    @Builder.Default
    @Column(name = "security_deposit_balance", nullable = false, precision = 10, scale = 2)
    private BigDecimal securityDepositBalance = BigDecimal.ZERO;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    @Column(name = "lapsed_date")
    private LocalDate lapsedDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "membership", cascade = CascadeType.ALL)
    private List<Nominee> nominees;
}