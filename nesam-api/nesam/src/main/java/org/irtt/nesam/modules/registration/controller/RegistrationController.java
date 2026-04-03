package org.irtt.nesam.modules.registration.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.registration.dto.request.*;
import org.irtt.nesam.modules.registration.dto.response.*;
import org.irtt.nesam.modules.registration.service.FeeCalculationService;
import org.irtt.nesam.modules.registration.service.RegistrationOtpService;
import org.irtt.nesam.modules.registration.service.RegistrationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/public/registration")
@Tag(name = "Registration Flow", description = "Endpoints for atomic NESAm Registration")
@Slf4j
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final RegistrationOtpService registrationOtpService;
    private final FeeCalculationService feeCalculationService;

    @Operation(summary = "Initiate registration — email eligibility check",
        description = "Checks if the given email has a pending application or is an eligible alumni member.")
    @ApiResponse(responseCode = "200", description = "Eligibility check completed")
    @ApiResponse(responseCode = "422", description = "Email missing or invalid format")
    @PostMapping("/initiate")
    public ResponseEntity<InitiateRegistrationResponse> initiateRegistration(@Valid @RequestBody InitiateRegistrationRequest request) {
        return ResponseEntity.ok(registrationService.initiate(request.email()));
    }

    @Operation(summary = "Send OTP to email")
    @ApiResponse(responseCode = "200", description = "OTP sent successfully")
    @ApiResponse(responseCode = "429", description = "Too many OTP requests — wait before retrying")
    @PostMapping("/send-otp")
    public ResponseEntity<SendOtpResponse> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        return ResponseEntity.ok(registrationOtpService.sendOtp(request.email()));
    }

    @Operation(summary = "Verify OTP and obtain REGISTRATION JWT")
    @ApiResponse(responseCode = "200", description = "OTP valid — JWT issued")
    @ApiResponse(responseCode = "422", description = "OTP invalid or expired")
    @PostMapping(value = "/verify-otp", consumes = "text/plain")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody String rawToken) {
        return ResponseEntity.ok(registrationOtpService.verifyOtp(rawToken));
    }

    @Operation(summary = "Get prefill data for registration wizard",
        security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Prefill data returned")
    @GetMapping("/prefill")
    public ResponseEntity<PrefillResponse> getPrefill(Authentication authentication) {
        return ResponseEntity.ok(registrationService.prefill(authentication.getName()));
    }

    @Operation(summary = "Preview membership fee breakdown",
        security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Fee breakdown calculated")
    @GetMapping("/fee-preview")
    public ResponseEntity<FeePreviewResponse> getFeePreview(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth, 
            Authentication authentication) {
        return ResponseEntity.ok(feeCalculationService.calculate(dateOfBirth, authentication.getName()));
    }

    @Operation(summary = "Save or update registration form data",
        security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Details saved")
    @PatchMapping("/details")
    public ResponseEntity<SaveDetailsResponse> saveDetails(
            @Valid @RequestBody SaveDetailsRequest request, Authentication authentication) {
        return ResponseEntity.ok(registrationService.saveDetails(request, authentication.getName()));
    }

    @Operation(summary = "Submit registration and create membership",
        security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "201", description = "Membership created successfully")
    @PostMapping("/submit")
    public ResponseEntity<SubmitResponse> submitApplication(
            @Valid @RequestBody SubmitApplicationRequest request, Authentication authentication) {
        return ResponseEntity.status(201).body(registrationService.submit(request.applicationId(), request, authentication.getName()));
    }
}
