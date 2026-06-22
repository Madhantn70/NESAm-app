package org.irtt.nesam.web;

import lombok.RequiredArgsConstructor;
import org.irtt.nesam.data.models.dto.RegistrationRequest;
import org.irtt.nesam.services.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/registration")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(registrationService.register(request));
    }
}
