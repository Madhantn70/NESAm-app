package org.irtt.nesam.modules.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.authentication.ott.OneTimeTokenAuthenticationToken;
import org.springframework.security.authentication.ott.OneTimeTokenService;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    JwtEncoder encoder;

    @Autowired
    OneTimeTokenService oneTimeTokenService;

    @GetMapping("/ott/dispatch")
    public ResponseEntity<String> dispatchOneTimeToken() {
        return ResponseEntity.ok("ott dispatched");
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
