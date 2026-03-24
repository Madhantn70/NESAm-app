package org.irtt.nesam.data.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    private Types.MembershipStatus currentStatus = Types.MembershipStatus.PENDING;

    @Column(nullable = false)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Types.GenderType gender;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "membership_type", nullable = false)
    private Types.MembershipCategory membershipType;

    @Column(name = "is_founding_member", nullable = false)
    private Boolean isFoundingMember = false;

    @Column(name = "is_senior_exempt")
    private Boolean isSeniorExempt = false;

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