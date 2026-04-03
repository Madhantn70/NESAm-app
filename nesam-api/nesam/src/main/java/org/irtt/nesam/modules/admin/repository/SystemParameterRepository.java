package org.irtt.nesam.modules.admin.repository;

import org.irtt.nesam.modules.admin.domain.model.SystemParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemParameterRepository extends JpaRepository<SystemParameter, String> {
}
