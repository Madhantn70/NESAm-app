package org.irtt.nesam.modules.admin.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "master_dfc_rate_slabs")
@Getter
@Setter
public class MasterDfcRateSlab extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "rate_slab_id", updatable = false, nullable = false)
    private UUID rateSlabId;

    @Column(name = "min_age", nullable = false)
    private Integer minAge;

    @Column(name = "max_age", nullable = false)
    private Integer maxAge;

    @Column(name = "display_label", nullable = false, length = 50)
    private String displayLabel;

    @Column(name = "dfc_per_event", nullable = false, precision = 10, scale = 2)
    private BigDecimal dfcPerEvent;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
