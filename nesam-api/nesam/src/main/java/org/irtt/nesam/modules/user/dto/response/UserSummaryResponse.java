package org.irtt.nesam.modules.user.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserSummaryResponse {
    private UUID nesamUserId;
    private String fullName;
    private String email;
    private String mobile;
    private String department;
    private Integer graduatingYear;
    private String status;
}
