package org.irtt.nesam.modules.registration.service;

import lombok.RequiredArgsConstructor;
import org.irtt.nesam.modules.admin.domain.model.MasterDfcRateSlab;
import org.irtt.nesam.modules.admin.domain.model.MasterMembershipFeeSlab;
import org.irtt.nesam.modules.admin.domain.model.SystemParameter;
import org.irtt.nesam.modules.admin.repository.MasterDfcRateSlabRepository;
import org.irtt.nesam.modules.admin.repository.MasterMembershipFeeSlabRepository;
import org.irtt.nesam.modules.admin.repository.SystemParameterRepository;
import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMaster;
import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMembershipType;
import org.irtt.nesam.modules.alumni.repository.AaAlumniMasterRepository;
import org.irtt.nesam.modules.registration.dto.response.FeePreviewResponse;
import org.irtt.nesam.modules.registration.exception.RegistrationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
public class FeeCalculationService {

    private final MasterMembershipFeeSlabRepository membershipFeeSlabRepository;
    private final MasterDfcRateSlabRepository dfcRateSlabRepository;
    private final SystemParameterRepository systemParamRepository;
    private final AaAlumniMasterRepository alumniRepository;

    public FeePreviewResponse calculate(LocalDate dateOfBirth, String email) {
        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();

        if (age >= 60) {
            throw new RegistrationException("Age must be below 60 to register");
        }

        MasterMembershipFeeSlab feeSlab = membershipFeeSlabRepository
            .findActiveSlabForAge(age, LocalDate.now())
            .stream().findFirst()
            .orElseThrow(() -> new RegistrationException("No active fee slab for age: " + age));
            
        MasterDfcRateSlab dfcSlab = dfcRateSlabRepository
            .findActiveSlabForAge(age, LocalDate.now())
            .stream().findFirst()
            .orElseThrow(() -> new RegistrationException("No active DFC slab for age: " + age));

        int multiplier = Integer.parseInt(
            systemParamRepository.findById("ADVANCE_DFC_MULTIPLIER")
                .map(SystemParameter::getParamValue).orElse("5"));

        AaAlumniMaster alumni = alumniRepository.findByEmailId(email)
            .orElseThrow(() -> new RegistrationException("Alumni record not found"));

        boolean isPatron = AaAlumniMembershipType.PATRON.equals(alumni.getMembershipType());
        boolean isFounding = computeIsFounding();

        String tierApplied = determineTier(isPatron, isFounding);
        BigDecimal discountPercent = getDiscountPercent(tierApplied);

        BigDecimal baseFee = feeSlab.getMembershipFee();
        String slabSource = "AGE";

        BigDecimal discountAmount = baseFee.multiply(discountPercent).divide(BigDecimal.valueOf(100));
        BigDecimal finalFee = baseFee.subtract(discountAmount);

        BigDecimal advanceDfc = dfcSlab.getDfcPerEvent().multiply(BigDecimal.valueOf(multiplier));
        BigDecimal total = finalFee.add(advanceDfc);

        String ageSlab = feeSlab.getMinAge() + " - " + feeSlab.getMaxAge() + " Years";

        return new FeePreviewResponse(
            age, ageSlab, baseFee, discountPercent, discountAmount, 
            finalFee, dfcSlab.getDfcPerEvent(), multiplier, advanceDfc, total, 
            tierApplied, slabSource
        );
    }

    public boolean computeIsFounding() {
        String launchDateStr = systemParamRepository.findById("PROGRAM_LAUNCH_DATE")
            .map(SystemParameter::getParamValue).orElse(null);
        String windowDaysStr = systemParamRepository.findById("FOUNDING_WINDOW_DAYS")
            .map(SystemParameter::getParamValue).orElse("90");

        if (launchDateStr == null) return false;
        LocalDate launchDate = LocalDate.parse(launchDateStr);
        LocalDate foundingWindowEnd = launchDate.plusDays(Integer.parseInt(windowDaysStr));
        return LocalDate.now().isBefore(foundingWindowEnd) || LocalDate.now().isEqual(foundingWindowEnd);
    }

    private String determineTier(boolean isPatron, boolean isFounding) {
        if (isPatron && isFounding) return "FOUNDING_PATRON";
        if (isFounding) return "FOUNDING";
        if (isPatron) return "PATRON";
        return "REGULAR";
    }

    private BigDecimal getDiscountPercent(String tier) {
        String paramKey = tier + "_DISCOUNT_PERCENT";
        if ("REGULAR".equals(tier)) return BigDecimal.ZERO;
        return new BigDecimal(systemParamRepository.findById(paramKey)
            .map(SystemParameter::getParamValue).orElse("0"));
    }
}
