package org.irtt.nesam.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.data.models.Alumni;
import org.irtt.nesam.data.models.dto.VerifyRequest;
import org.irtt.nesam.data.models.dto.VerifyResponse;
import org.irtt.nesam.services.AlumniNotFoundException;
import org.irtt.nesam.services.AlumniService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/alumni")
@RequiredArgsConstructor
@Slf4j
public class AlumniController {

    private final AlumniService alumniService;

    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verifyAlumni(@Valid @RequestBody VerifyRequest request) {
        log.info("Received request to verify alumni");
        Alumni alumni = alumniService.verifyAndFetchAlumni(request.getEmail());
        
        VerifyResponse.VerifyData data = VerifyResponse.VerifyData.builder()
                .name(alumni.getName())
                .batch(alumni.getBatch())
                .department(alumni.getDepartment())
                .email(alumniService.maskEmail(alumni.getEmail()))
                .build();

        return ResponseEntity.ok(
                VerifyResponse.builder()
                        .success(true)
                        .data(data)
                        .build()
        );
    }

    @ExceptionHandler(AlumniNotFoundException.class)
    public ResponseEntity<VerifyResponse> handleAlumniNotFoundException(AlumniNotFoundException ex) {
        log.warn("Alumni verification failed: {}", ex.getMessage());
        VerifyResponse response = VerifyResponse.builder()
                .success(false)
                .error(VerifyResponse.ErrorDetail.builder().message(ex.getMessage()).build())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
