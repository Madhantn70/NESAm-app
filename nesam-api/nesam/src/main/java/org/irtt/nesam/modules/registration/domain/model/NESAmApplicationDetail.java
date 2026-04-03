package org.irtt.nesam.modules.registration.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.irtt.nesam.modules.membership.domain.model.NomineeRelationship;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "nesam_application_details")
@Getter
@Setter
@NoArgsConstructor
public class NESAmApplicationDetail {

    @Id
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "application_id", updatable = false, nullable = false)
    private UUID applicationId;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "line1", length = 255)
    private String line1;

    @Column(name = "line2", length = 255)
    private String line2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "nominee_name", length = 255, nullable = false)
    private String nomineeName = "Pending";

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "nominee_relationship", nullable = false)
    private NomineeRelationship nomineeRelationship = NomineeRelationship.OTHER;

    @Column(name = "nominee_email", length = 200)
    private String nomineeEmail;

    @Column(name = "nominee_mobile", length = 20)
    private String nomineeMobile;

    public NESAmApplicationDetail(UUID applicationId) {
        this.applicationId = applicationId;
    }
}
