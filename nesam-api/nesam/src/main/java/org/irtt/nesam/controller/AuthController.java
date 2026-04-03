package org.irtt.nesam.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.irtt.nesam.dto.ApiResponse;
import org.irtt.nesam.security.TokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final TokenProvider tokenProvider;
    private final JwtDecoder jwtDecoder;

    public AuthController(TokenProvider tokenProvider, JwtDecoder jwtDecoder) {
        this.tokenProvider = tokenProvider;
        this.jwtDecoder = jwtDecoder;
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody TokenRefreshRequest request) {
        try {
            Jwt jwt = jwtDecoder.decode(request.getRefreshToken());
            String username = jwt.getSubject();
            
            String newAccessToken = tokenProvider.generateAccessToken(username);
            String newRefreshToken = tokenProvider.generateRefreshToken(username);
            
            return ResponseEntity.ok(ApiResponse.success(
                    new AuthResponse(newAccessToken, newRefreshToken),
                    "Token refreshed successfully"
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid refresh token", Collections.singletonList(ex.getMessage())));
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TokenRefreshRequest {
        private String refreshToken;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
    }
}
