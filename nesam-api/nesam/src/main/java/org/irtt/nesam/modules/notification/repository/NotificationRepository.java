package org.irtt.nesam.modules.notification.repository;

import org.irtt.nesam.modules.notification.domain.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<NotificationLog, UUID> {
}
