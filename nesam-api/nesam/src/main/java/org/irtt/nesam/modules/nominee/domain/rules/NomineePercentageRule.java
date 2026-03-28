package org.irtt.nesam.modules.nominee.domain.rules;

import org.irtt.nesam.modules.nominee.domain.model.Nominee;
import java.math.BigDecimal;
import java.util.List;

public class NomineePercentageRule {
    public static void validateTotalPercentage(List<Nominee> nominees) {
        if (nominees == null || nominees.isEmpty()) {
            throw new IllegalArgumentException("At least one nominee is required.");
        }
        
        BigDecimal total = nominees.stream()
                .map(Nominee::getPercentageShare)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        if (total.compareTo(new BigDecimal("100.00")) != 0) {
            throw new IllegalArgumentException("Total nominee percentage must equal 100%");
        }
    }
}
