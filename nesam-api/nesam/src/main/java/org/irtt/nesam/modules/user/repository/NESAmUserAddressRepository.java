package org.irtt.nesam.modules.user.repository;

import org.irtt.nesam.modules.user.domain.model.NESAmUserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NESAmUserAddressRepository extends JpaRepository<NESAmUserAddress, UUID> {
    List<NESAmUserAddress> findByNesamUserId(UUID nesamUserId);
}
