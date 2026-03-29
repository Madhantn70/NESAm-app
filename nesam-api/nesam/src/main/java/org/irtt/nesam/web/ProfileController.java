package org.irtt.nesam.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ott.GenerateOneTimeTokenRequest;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.authentication.ott.OneTimeTokenAuthenticationToken;
import org.springframework.security.authentication.ott.OneTimeTokenService;
import org.springframework.security.core.Authentication; // ✅ ADD THIS
import org.irtt.nesam.services.UserProfileService;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final UserProfileService userService;
    private final ProfileRepository userRepository;
    private final JwtEncoder encoder;
    private final OneTimeTokenService oneTimeTokenService;

    @PostMapping("/register")
    public ResponseEntity<UserProfile> createUser(@Valid @RequestBody UserProfileDTO dto) {
        try {
            UserProfile profile = userService.registerUser(dto);
            return new ResponseEntity<>(profile, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error during registration: ", e);
            throw e;
        }
    }

    @Operation(summary = "Returns a UserProfile if found")
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(security = @SecurityRequirement(name = "Bearer Authentication"))
    @GetMapping
    public List<UserProfile> getAllUsers() {
        return userRepository.findAll();
    }

    @Operation(security = @SecurityRequirement(name = "Bearer Authentication"))
    @GetMapping("/me")
    public ResponseEntity<UserProfile> getCurrentUser(Authentication authentication) {
        String mobile = authentication.getName(); // comes from JWT
        log.info("JWT subject: {}", authentication.getName());
        return userRepository.findByMobileNumber(mobile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ott/dispatch")
    public ResponseEntity<String> dispatchOneTimeToken() {
        return ResponseEntity.ok("ott dispatched");
    }

    @Operation(summary = "test")
    @GetMapping("/test")
    public ResponseEntity<String> testMethod() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/ott/token")
    @Operation(summary = "Generate and print OTT for a mobile number")
    public ResponseEntity<String> generateToken(@RequestBody String mobileNumber) {
        log.info("OTT token request received for: {}", mobileNumber);
        log.info("Generating OTT for mobile: {}", mobileNumber);
        
        // Use Spring Security's OneTimeTokenService
        OneTimeToken token = oneTimeTokenService.generate(new GenerateOneTimeTokenRequest(mobileNumber, Duration.ofMinutes(10)));
        
        log.info("========================================");
        log.info("Generated OTT token: {}", token.getTokenValue());
        log.info("========================================");
        
        return ResponseEntity.ok("OTP generated and printed to console");
    }

    @PostMapping("/ott/login")
    public ResponseEntity<String> authenticateToken(@RequestBody String token) {
        try {
            OneTimeToken oneTimeToken = oneTimeTokenService.consume(new OneTimeTokenAuthenticationToken(token));

            Instant now = Instant.now();
            long expiry = 36000L;

            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(expiry))
                    .subject(oneTimeToken.getUsername()) // mobile number
                    .claim("scope", "USER")
                    .build();

            log.info("JWT issued successfully for: {}", oneTimeToken.getUsername());
            return ResponseEntity.ok(this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue());
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("401 Invalid or expired token");
        }
    }
}