package org.irtt.nesam.modules.user.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.irtt.nesam.modules.membership.domain.model.Membership;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue
    @Column(name = "user_uuid", updatable = false, nullable = false)
    private UUID userUuid;

    @Column(name = "mobile_number", nullable = false, unique = true, length = 15)
    private String mobileNumber;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 100)
    private String email;

    @Column(name = "irttaa_id", length = 50)
    private String irttaaId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user")
    private Membership membership;
}