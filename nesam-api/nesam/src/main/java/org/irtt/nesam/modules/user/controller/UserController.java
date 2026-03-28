package org.irtt.nesam.modules.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.user.dto.request.UserProfileRequestDTO;
import org.irtt.nesam.modules.user.dto.response.UserProfileResponseDTO;
import org.irtt.nesam.modules.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserProfileResponseDTO> createUser(@Valid @RequestBody UserProfileRequestDTO dto) {
        try {
            UserProfileResponseDTO profile = userService.createUser(dto);
            return new ResponseEntity<>(profile, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("error while creating ", e);
            throw new RuntimeException(e);
        }
    }

    @Operation(summary = "Returns a UserProfile if found")
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponseDTO> getUserById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(security = @SecurityRequirement(name = "Bearer Authentication"))
    @GetMapping
    public List<UserProfileResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @Operation(security = @SecurityRequirement(name = "Bearer Authentication"))
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> getCurrentUser(Authentication authentication) {
        String subject = authentication.getName();
        log.info("JWT subject: {}", subject);
        try {
            UUID id = UUID.fromString(subject);
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}