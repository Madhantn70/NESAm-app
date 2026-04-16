package org.irtt.nesam.services;

import lombok.RequiredArgsConstructor;
import org.irtt.nesam.data.models.*;
import org.irtt.nesam.data.models.dto.RegistrationRequest;
import org.irtt.nesam.data.models.dto.RegistrationResponse;
import org.irtt.nesam.data.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final ProfileRepository profileRepository;
    private final MembershipRepository membershipRepository;
    private final NomineeRepository nomineeRepository;
    private final TransactionLedgerRepository ledgerRepository;

    @Transactional
    public RegistrationResponse register(RegistrationRequest req) {

        validateAge(req);
        validateNominees(req);

        UserProfile user = createUser(req);
        Membership membership = createMembership(user, req);
        createNominees(membership, req);

        createLedgerEntries(user, membership);

        return new RegistrationResponse(true, membership.getNesamId());
    }

    private void validateAge(RegistrationRequest req) {
        LocalDate dob = req.getAgeData().getDateOfBirth();
        int age = Period.between(dob, LocalDate.now()).getYears();
        if (age >= 60) {
            throw new IllegalArgumentException("Age must be less than 60 years (INV-EL-02)");
        }
    }

    private void validateNominees(RegistrationRequest req) {
        double totalPercentage = req.getNominees().stream()
                .mapToDouble(RegistrationRequest.NomineeData::getPercentageShare)
                .sum();
        
        // Use a small epsilon for floating point comparison
        if (Math.abs(totalPercentage - 100.0) > 0.01) {
            throw new IllegalArgumentException("Nominee percentage sum must be 100 (INV-NM-01)");
        }
    }

    private UserProfile createUser(RegistrationRequest req) {
        String mobile = req.getContactData().getMobile();
        return profileRepository.findByMobileNumber(mobile)
                .orElseGet(() -> {
                    UserProfile newUser = new UserProfile();
                    newUser.setMobileNumber(mobile);
                    newUser.setFullName(req.getContactData().getFullName());
                    newUser.setEmail(req.getEmail());
                    return profileRepository.save(newUser);
                });
    }

    private Membership createMembership(UserProfile user, RegistrationRequest req) {
        // Check INV-ML-02 (One active membership)
        List<Membership> existing = membershipRepository.findAll();
        boolean hasActive = existing.stream().anyMatch(m -> 
            m.getUser().getUserUuid().equals(user.getUserUuid()) && 
            m.getCurrentStatus() == Types.MembershipStatus.ACTIVE);
        
        if (hasActive) {
            throw new IllegalStateException("User already has an active membership (INV-ML-02)");
        }

        Membership membership = new Membership();
        
        // Generate nesamId logic (simple mock implementation as actual sequence is not requested)
        long count = membershipRepository.count() + 1;
        membership.setNesamId("NES-" + LocalDate.now().getYear() + "-" + String.format("%03d", count));
        
        membership.setUser(user);
        membership.setDob(req.getAgeData().getDateOfBirth());
        membership.setGender(Types.GenderType.valueOf(req.getAgeData().getGender()));
        membership.setGraduationYear(req.getAgeData().getGraduationYear());
        membership.setMembershipType(Types.MembershipCategory.valueOf(req.getMembershipType()));
        membership.setEnrollmentDate(LocalDate.now());
        membership.setCurrentStatus(Types.MembershipStatus.PENDING); // initially pending
        membership.setSecurityDepositBalance(BigDecimal.ZERO);
        membership.setIsFoundingMember(false);
        membership.setIsSeniorExempt(false);
        
        // ER v2 mappings
        membership.setAddressLine1(req.getContactData().getAddressLine1());
        membership.setAddressLine2(req.getContactData().getAddressLine2());
        membership.setCity(req.getContactData().getCity());
        membership.setState(req.getContactData().getState());
        membership.setPinCode(req.getContactData().getPinCode());
        membership.setCountry(req.getContactData().getCountry());
        membership.setBranch(req.getContactData().getBranch());
        membership.setSelfDeclarationAccepted(req.getSelfDeclarationAccepted());

        return membershipRepository.save(membership);
    }

    private void createNominees(Membership membership, RegistrationRequest req) {
        List<Nominee> nomineesToSave = new ArrayList<>();
        
        for (RegistrationRequest.NomineeData nd : req.getNominees()) {
            Nominee nominee = new Nominee();
            nominee.setMembership(membership);
            nominee.setFullName(nd.getName());
            nominee.setRelationship(nd.getRelationship());
            nominee.setDob(nd.getDob());
            nominee.setPercentageShare(BigDecimal.valueOf(nd.getPercentageShare()));
            nominee.setMobileNumber(nd.getMobile());
            nomineesToSave.add(nominee);
        }
        nomineeRepository.saveAll(nomineesToSave);
    }

    private void createLedgerEntries(UserProfile user, Membership membership) {
        TransactionLedger ledger = new TransactionLedger();
        ledger.setUser(user);
        ledger.setMembership(membership);
        ledger.setType(Types.TransactionType.DEMAND);
        ledger.setCategory(Types.TransactionCategory.MEMBERSHIP_FEE);
        ledger.setAmount(BigDecimal.valueOf(2500)); // Example mocked fee amount for demand
        ledger.setStatus(Types.TransactionStatus.PENDING);
        
        ledgerRepository.save(ledger);
    }
}
