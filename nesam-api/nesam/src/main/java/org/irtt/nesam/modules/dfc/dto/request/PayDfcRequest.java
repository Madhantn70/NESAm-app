package org.irtt.nesam.modules.dfc.dto.request;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PayDfcRequest {
    private BigDecimal amount;
    private String paymentMode;
    private String trxReferenceNo;
    private String notes;
}
