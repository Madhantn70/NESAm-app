package org.irtt.nesam.data.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberSummaryDTO {
    private String memberName;
    private Integer memberSince;
    private String membershipStatus; // E.g., "Active", "Lapsed"
    private String membershipFeeStatus; // E.g., "Paid", "Pending"
    private Boolean hasPendingDFC;
    private Integer familiesSupported;
    private Boolean hasActiveDFC;
    private String contributionDueDate;
}
