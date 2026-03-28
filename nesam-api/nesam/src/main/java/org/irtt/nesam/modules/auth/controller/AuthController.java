package org.irtt.nesam.modules.auth.controller;

import org.irtt.nesam.modules.user.domain.model.UserProfile;
import org.irtt.nesam.modules.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ott.GenerateOneTimeTokenRequest;

import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.authentication.ott.OneTimeTokenAuthenticationToken;
import org.springframework.security.authentication.ott.OneTimeTokenService;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users/ott")
@Tag(name = "Authentication", description = "Endpoints for generating and verifying Email OTPs")
@Slf4j
public class AuthController {

    @Autowired
    private JwtEncoder encoder;

    @Autowired
    private OneTimeTokenService oneTimeTokenService;

    @Autowired
    private UserService userService;

    @Operation(summary = "Generate OTP via Email")
    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Void> generateToken(@RequestParam("email") String email) {
        try {
            userService.getUserEntityByEmail(email);
            // Email exists, generate OTP
            OneTimeToken token = oneTimeTokenService.generate(new GenerateOneTimeTokenRequest(email, Duration.ofSeconds(600)));
            log.info("Testing Console Provider: OTP for {} is [{}]", email, token.getTokenValue());
        } catch (Exception e) {
            // Do nothing to prevent exposing whether an email exists or not
        }
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Verify OTP and login", description = "Provide plain text OTP to receive a JWT token")
    @PostMapping(value = "/login", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> authenticateToken(@RequestBody String token) {
        OneTimeToken oneTimeToken = oneTimeTokenService.consume(new OneTimeTokenAuthenticationToken(token));

        String email = oneTimeToken.getUsername();
        UserProfile user = userService.getUserEntityByEmail(email);

        Instant now = Instant.now();
        long expiry = 36000L;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("nesam-auth")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(user.getUserUuid().toString())
                .claim("email", user.getEmail())
                .claim("role", "ROLE_USER")
                .build();

        return ResponseEntity.ok(this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue());
    }
}
