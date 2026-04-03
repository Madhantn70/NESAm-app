package org.irtt.nesam.modules.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.user.domain.model.NESAmUser;
import org.irtt.nesam.modules.user.domain.model.NESAmUserAddress;
import org.irtt.nesam.modules.user.domain.model.NesamUserStatus;
import org.irtt.nesam.modules.user.domain.model.AddressType;
import org.irtt.nesam.modules.user.dto.request.CreateUserRequest;
import org.irtt.nesam.modules.user.repository.NESAmUserAddressRepository;
import org.irtt.nesam.modules.user.repository.NESAmUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final NESAmUserRepository userRepository;
    private final NESAmUserAddressRepository addressRepository;

    public Optional<NESAmUser> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public NESAmUser getExistingUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found by email"));
    }

    @Transactional
    public NESAmUser createUserWithAddress(CreateUserRequest request) {
        // 1. Save User
        NESAmUser user = new NESAmUser();
        user.setEmail(request.getEmail());
        user.setAaAlumniId(request.getAaAlumniId());
        user.setFullName(request.getFullName());
        user.setMobile(request.getMobile());
        user.setGraduatingYear(request.getGraduatingYear());
        user.setDepartment(request.getDepartment());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setStatus(NesamUserStatus.ACTIVE);
        
        user = userRepository.save(user);

        // 2. Save Address
        NESAmUserAddress address = new NESAmUserAddress();
        address.setNesamUserId(user.getNesamUserId());
        address.setAddressType(AddressType.CORRESPONDENCE);
        address.setLine1(request.getAddressLine1());
        address.setLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        
        addressRepository.save(address);

        return user;
    }
}