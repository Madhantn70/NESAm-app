package org.irtt.nesam.shared.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.shared.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NESAmException.class)
    public ResponseEntity<ApiErrorResponse> handleNESAmException(NESAmException ex, HttpServletRequest request) {
        log.warn("NESAmException [{}] at {}: {}", ex.getCode(), request.getRequestURI(), ex.getMessage());
        
        HttpStatus status = switch (ex.getCode()) {
            case "INV-ML-02" -> HttpStatus.CONFLICT;
            default -> HttpStatus.valueOf(422); // 422 for INV-EL-02, INV-NM-01, INV-EL-01
        };

        ApiErrorResponse error = ApiErrorResponse.builder()
                .type(ex.getCode())
                .title(status.getReasonPhrase())
                .status(status.value())
                .detail(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ApiErrorResponse.ValidationError> violations = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> ApiErrorResponse.ValidationError.builder()
                        .field(err.getField())
                        .message(err.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        ApiErrorResponse error = ApiErrorResponse.builder()
                .type("VALIDATION_ERROR")
                .title("Validation Failed")
                .status(HttpStatus.valueOf(422).value())
                .detail("One or more fields failed validation")
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .violations(violations)
                .build();

        return new ResponseEntity<>(error, HttpStatus.valueOf(422));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ApiErrorResponse error = ApiErrorResponse.builder()
                .type("ILLEGAL_ARGUMENT")
                .title(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex, HttpServletRequest request) {
        ApiErrorResponse error = ApiErrorResponse.builder()
                .type("NOT_FOUND")
                .title(HttpStatus.NOT_FOUND.getReasonPhrase())
                .status(HttpStatus.NOT_FOUND.value())
                .detail(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(org.irtt.nesam.modules.registration.exception.RegistrationException.class)
    public ResponseEntity<ApiErrorResponse> handleRegistrationException(org.irtt.nesam.modules.registration.exception.RegistrationException ex, HttpServletRequest request) {
        log.warn("RegistrationException at {}: {}", request.getRequestURI(), ex.getMessage());
        ApiErrorResponse error = ApiErrorResponse.builder()
                .type("REGISTRATION_ERROR")
                .title(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.irtt.nesam.modules.registration.exception.OtpValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleOtpValidationException(org.irtt.nesam.modules.registration.exception.OtpValidationException ex, HttpServletRequest request) {
        log.warn("OtpValidationException at {}: {}", request.getRequestURI(), ex.getMessage());
        ApiErrorResponse error = ApiErrorResponse.builder()
                .type("OTP_VALIDATION_ERROR")
                .title(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception at {}: ", request.getRequestURI(), ex);
        ApiErrorResponse error = ApiErrorResponse.builder()
                .type("INTERNAL_ERROR")
                .title(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .detail("An unexpected error occurred. Please contact support if the issue persists.")
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}