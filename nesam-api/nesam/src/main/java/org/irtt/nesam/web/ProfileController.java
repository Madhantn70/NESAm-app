package org.irtt.nesam.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.UserProfile;
import org.irtt.nesam.data.models.dto.UserProfileDTO;
import org.irtt.nesam.data.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.authentication.ott.OneTimeTokenAuthenticationToken;
import org.springframework.security.authentication.ott.OneTimeTokenService;
import org.springframework.security.core.Authentication; // ✅ ADD THIS
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileRepository userRepository;

    @Autowired
    JwtEncoder encoder;

    @Autowired
    OneTimeTokenService oneTimeTokenService;

    @PostMapping("/register")
    public ResponseEntity<UserProfile> createUser(@Valid @RequestBody UserProfileDTO dto) {
        UserProfile user = new UserProfile();
        user.setMobileNumber(dto.mobileNumber());
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setIrttaaId(dto.irttaaId());
        try {
            UserProfile profile = userRepository.save(user);
            return new ResponseEntity<>(profile, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("error while creating ", e);
            throw new RuntimeException(e);
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

    // 🔥 NEW ENDPOINT (IMPORTANT)
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

    @PostMapping("/ott/login")
    public ResponseEntity<String> authenticateToken(
            @RequestBody String token) {
        OneTimeToken oneTimeToken = oneTimeTokenService.consume(
                new OneTimeTokenAuthenticationToken(token));

        Instant now = Instant.now();
        long expiry = 36000L;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(oneTimeToken.getUsername()) // mobile number
                .claim("scope", "testing-scope")
                .build();

        return ResponseEntity.ok(
                this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue());
    }
}