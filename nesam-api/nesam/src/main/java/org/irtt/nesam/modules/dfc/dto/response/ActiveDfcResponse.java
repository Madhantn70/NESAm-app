package org.irtt.nesam.modules.dfc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ActiveDfcResponse {
    private BigDecimal amountPaid;
    private LocalDate validUntil;
    private boolean isActive;
}
