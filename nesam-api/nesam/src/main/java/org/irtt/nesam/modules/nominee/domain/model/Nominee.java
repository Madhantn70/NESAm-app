package org.irtt.nesam.modules.nominee.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.irtt.nesam.modules.membership.domain.model.Membership;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nominees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nominee {
    @Id
    @GeneratedValue
    @Column(name = "nominee_id", updatable = false, nullable = false)
    private UUID nomineeId;

    @ManyToOne
    @JoinColumn(name = "nesam_id", nullable = false)
    private Membership membership;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 50)
    private String relationship;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(name = "percentage_share", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentageShare;

    @Column(name = "mobile_number", length = 15)
    private String mobileNumber;
}