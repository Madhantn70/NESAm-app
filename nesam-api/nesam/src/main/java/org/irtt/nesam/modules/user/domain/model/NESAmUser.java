package org.irtt.nesam.modules.user.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nesam_users")
@Getter
@Setter
public class NESAmUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nesam_user_id", updatable = false, nullable = false)
    private UUID nesamUserId;

    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "aa_alumni_id")
    private UUID aaAlumniId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "graduating_year", nullable = false)
    private Integer graduatingYear;

    @Column(name = "department", length = 15)
    private String department;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private NesamUserStatus status = NesamUserStatus.ACTIVE;
}
