package org.irtt.nesam.modules.dfc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class PayDfcResponse {
    private UUID dfcId;
    private String status;
    private String message;
}
