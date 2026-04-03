package org.irtt.nesam.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {
    private String type;
    private String title;
    private int status;
    private String detail;
    private String path;
    private Instant timestamp;
    private List<ValidationError> violations;

    @Data
    @Builder
    public static class ValidationError {
        private String field;
        private String message;
    }
}
