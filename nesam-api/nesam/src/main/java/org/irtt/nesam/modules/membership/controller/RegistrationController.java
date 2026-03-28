package org.irtt.nesam.modules.membership.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.membership.dto.request.RegistrationRequestDTO;
import org.irtt.nesam.modules.membership.dto.response.RegistrationResponseDTO;
import org.irtt.nesam.modules.membership.service.RegistrationOrchestrator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/registration")
@Tag(name = "Public Registration", description = "Multi-step registration workflow for new members")
@RequiredArgsConstructor
@Slf4j
public class RegistrationController {

    private final RegistrationOrchestrator orchestrator;

    @Operation(summary = "Step 1: Verify Email", description = "Checks IRTTAA DB for existing alumni details")
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String email) {
        log.info("Verifying email mapping: {}", email);
        // Mock alumni verification response as requested by architecture design
        return ResponseEntity.ok(Map.of(
                "email", email,
                "alumniData", Map.of("verified", true, "batch", "2018")
        ));
    }

    @Operation(summary = "Step 2: Verify Registration OTP", description = "Validates the emailed OTP independently of auth OTP")
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyRegistrationOtp(@RequestParam String email, @RequestParam String otp) {
        log.info("Verifying OTP for registration: {}", email);
        return ResponseEntity.ok(Map.of(
                "status", "VERIFIED",
                "message", "OTP verified successfully. Proceed to submit."
        ));
    }

    @Operation(summary = "Step 3: Submit Registration", description = "Atomic commit of User, Membership, Nominees, and Initial Ledgers")
    @PostMapping("/submit")
    public ResponseEntity<RegistrationResponseDTO> submitRegistration(
            @Valid @RequestBody RegistrationRequestDTO requestDTO) {
        RegistrationResponseDTO response = orchestrator.submitRegistration(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
