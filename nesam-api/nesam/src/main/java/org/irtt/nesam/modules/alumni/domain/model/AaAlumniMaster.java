package org.irtt.nesam.modules.alumni.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "aa_alumni_master")
@Getter
@Setter
public class AaAlumniMaster extends BaseEntity {

    @Id
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "aa_alumni_id", updatable = false, nullable = false)
    private UUID aaAlumniId;

    @Column(name = "email_id", unique = true, length = 200)
    private String emailId;

    @Column(name = "secondary_email", length = 200)
    private String secondaryEmail;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "profile_type", nullable = false, length = 15)
    private String profileType;

    @Column(name = "course", length = 45)
    private String course;

    @Column(name = "stream", length = 60)
    private String stream;

    @Column(name = "graduating_year")
    private Integer graduatingYear;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "corress_address", length = 255)
    private String corressAddress;

    @Column(name = "corress_city", length = 100)
    private String corressCity;

    @Column(name = "corress_state", length = 100)
    private String corressState;

    @Column(name = "corress_country", length = 100)
    private String corressCountry;

    @Column(name = "corress_pincode", length = 20)
    private String corressPincode;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "membership_type", nullable = false)
    private AaAlumniMembershipType membershipType; // Store exactly as enum string

    @Column(name = "membership_id", length = 50)
    private String membershipId;

    @Column(name = "deceased")
    private Boolean deceased = false;

    @Column(name = "deceased_at")
    private LocalDate deceasedAt;
}
