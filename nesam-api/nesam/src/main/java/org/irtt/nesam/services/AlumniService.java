package org.irtt.nesam.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.Alumni;
import org.irtt.nesam.data.repositories.AlumniRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlumniService {

    private final AlumniRepository alumniRepository;

    public Alumni verifyAndFetchAlumni(String email) {
        log.info("Verifying alumni with email: {}", email);
        return alumniRepository.findByEmail(email)
                .orElseThrow(() -> new AlumniNotFoundException("Alumni not found"));
    }

    public String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@");
        String namePart = parts[0];
        String domainPart = parts[1];
        
        if (namePart.length() <= 2) {
            return namePart + "***@" + domainPart;
        }
        
        String maskedName = namePart.substring(0, 2) + "***";
        return maskedName + "@" + domainPart;
    }
}
