package org.irtt.nesam.modules.admin.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.irtt.nesam.infrastructure.persistence.BaseEntity;

@Entity
@Table(name = "system_parameters")
@Getter
@Setter
public class SystemParameter extends BaseEntity {

    @Id
    @Column(name = "param_key", length = 100, updatable = false, nullable = false)
    private String paramKey;

    @Column(name = "param_value", length = 255)
    private String paramValue;

    @Column(name = "description", length = 255)
    private String description;
}
