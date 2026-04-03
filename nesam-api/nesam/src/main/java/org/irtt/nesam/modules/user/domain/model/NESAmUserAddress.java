package org.irtt.nesam.modules.user.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "nesam_user_addresses")
@Getter
@Setter
public class NESAmUserAddress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nesam_address_id", updatable = false, nullable = false)
    private UUID nesamAddressId;

    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "nesam_user_id", nullable = false)
    private UUID nesamUserId;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "address_type", nullable = false)
    private AddressType addressType = AddressType.CORRESPONDENCE;

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

    @Column(name = "country", length = 50)
    private String country;
}
