package org.irtt.nesam.data.repositories;

import static org.junit.jupiter.api.Assertions.*;


import org.irtt.nesam.data.models.UserProfile;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserProfileRepositoryTest {

    @Autowired
    private ProfileRepository userRepository;

//   TODO : fix tests
//    @Test
//    void shouldSaveAndFindUserByMobile() {
//
//        UserProfile user = new UserProfile();
//        user.setFullName("John Doe");
//        user.setMobileNumber("1234567890");
//
//        UserProfile savedUser = userRepository.save(user);
//
//        var foundUser = userRepository.findByMobileNumber("1234567890");
//
//        assertThat(foundUser).isPresent();
//        assertThat(foundUser.get().getFullName()).isEqualTo("John Doe");
//    }
}