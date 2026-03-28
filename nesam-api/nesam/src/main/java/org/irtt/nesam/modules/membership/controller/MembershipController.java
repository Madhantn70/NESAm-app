package org.irtt.nesam.modules.membership.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.irtt.nesam.modules.membership.dto.request.MembershipRequestDTO;
import org.irtt.nesam.modules.membership.dto.response.MembershipResponseDTO;
import org.irtt.nesam.modules.membership.service.MembershipService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @Operation(security = @SecurityRequirement(name = "Bearer Authentication"))
    @PostMapping("/register")
    public ResponseEntity<MembershipResponseDTO> createMembership(
            Authentication authentication,
            @RequestBody MembershipRequestDTO dto) {

        String userUuid = authentication.getName();
        MembershipResponseDTO created = membershipService.createMembership(userUuid, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
