package org.irtt.nesam.modules.registration.controller;

import org.irtt.nesam.modules.registration.exception.OtpValidationException;
import org.irtt.nesam.modules.registration.exception.RegistrationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class RegistrationExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RegistrationException.class)
    public ProblemDetail handleRegistrationException(RegistrationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.valueOf(422), ex.getMessage());
        problem.setTitle("Registration Error");
        return problem;
    }

    @ExceptionHandler(OtpValidationException.class)
    public ProblemDetail handleOtpException(OtpValidationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.valueOf(422), "Invalid or expired OTP");
        problem.setTitle("OTP Validation Failed");
        return problem;
    }
}
