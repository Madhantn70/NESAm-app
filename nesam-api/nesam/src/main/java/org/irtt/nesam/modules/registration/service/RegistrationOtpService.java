package org.irtt.nesam.modules.registration.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.registration.domain.model.ApplicationStatus;
import org.irtt.nesam.modules.registration.domain.model.NESAmApplication;
import org.irtt.nesam.modules.registration.dto.response.SendOtpResponse;
import org.irtt.nesam.modules.registration.dto.response.VerifyOtpResponse;
import org.irtt.nesam.modules.registration.exception.OtpValidationException;
import org.irtt.nesam.modules.registration.repository.NESAmApplicationRepository;
import org.springframework.security.authentication.ott.GenerateOneTimeTokenRequest;
import org.springframework.security.authentication.ott.OneTimeTokenAuthenticationToken;
import org.springframework.security.authentication.ott.OneTimeTokenService;
import org.springframework.security.authentication.ott.OneTimeToken;

import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationOtpService {

    private final OneTimeTokenService oneTimeTokenService;
    private final JwtEncoder jwtEncoder;
    private final NESAmApplicationRepository applicationRepository;

    public SendOtpResponse sendOtp(String email) {
        log.info("Generating OTT for {}", email);
        OneTimeToken token = oneTimeTokenService.generate(new GenerateOneTimeTokenRequest(email, Duration.ofSeconds(600)));
        log.info("DEV ONLY - OTT token for {}: {}", email, token.getTokenValue());
        return new SendOtpResponse(true, maskEmail(email), 600);
    }

    public VerifyOtpResponse verifyOtp(String rawToken) {
        OneTimeToken tokenObj;
        try {
            tokenObj = oneTimeTokenService.consume(new OneTimeTokenAuthenticationToken(rawToken));
        } catch (Exception e) {
            log.error("Failed to verify OTT", e);
            throw new OtpValidationException("Invalid or expired OTP");
        }
        
        String email = tokenObj.getUsername();
        
        Optional<NESAmApplication> pending = applicationRepository
                .findFirstByEmailIdAndStatusOrderByStartedAtDesc(email, ApplicationStatus.STARTED);

        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(email)
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofHours(24)))
                .claim("scope", "REGISTRATION")
                .claim("email", email)
                .build();
                
        JwsHeader jwsHeader = JwsHeader.with(() -> "RS256").build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

        String status = pending.isPresent() ? "PENDING_APPLICATION" : "NEW";
        
        return new VerifyOtpResponse(
                token,
                email,
                status,
                pending.map(NESAmApplication::getApplicationId).orElse(null)
        );
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        if (name.length() <= 2) {
            return name + "***@" + parts[1];
        }
        return name.substring(0, 2) + "***@" + parts[1];
    }
}
