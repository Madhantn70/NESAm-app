package org.irtt.nesam.modules.registration.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMaster;
import org.irtt.nesam.modules.alumni.repository.AaAlumniMasterRepository;
import org.irtt.nesam.modules.membership.domain.model.MemberNominee;
import org.irtt.nesam.modules.membership.domain.model.NESAmMember;
import org.irtt.nesam.modules.membership.repository.MemberNomineeRepository;
import org.irtt.nesam.modules.membership.repository.NESAmMemberRepository;
import org.irtt.nesam.modules.registration.domain.model.*;
import org.irtt.nesam.modules.registration.dto.request.SaveDetailsRequest;
import org.irtt.nesam.modules.registration.dto.request.SubmitApplicationRequest;
import org.irtt.nesam.modules.registration.dto.response.*;
import org.irtt.nesam.modules.registration.exception.RegistrationException;
import org.irtt.nesam.modules.registration.repository.*;
import org.irtt.nesam.modules.user.domain.model.NESAmUser;
import org.irtt.nesam.modules.user.domain.model.NESAmUserAddress;
import org.irtt.nesam.modules.user.repository.NESAmUserAddressRepository;
import org.irtt.nesam.modules.user.repository.NESAmUserRepository;
import org.irtt.nesam.modules.alumni.domain.model.AaAlumniMembershipType;
import org.irtt.nesam.modules.membership.domain.model.MembershipTier;
import org.irtt.nesam.modules.membership.domain.model.NomineeRelationship;
import org.irtt.nesam.modules.user.domain.model.AddressType;
import org.irtt.nesam.modules.user.domain.model.NesamUserStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final NESAmApplicationRepository applicationRepository;
    private final NESAmApplicationDetailRepository applicationDetailsRepository;
    private final NESAmApplicationPaymentRepository applicationPaymentRepository;
    private final AaAlumniMasterRepository alumniRepository;
    private final NESAmUserRepository userRepository;
    private final NESAmUserAddressRepository userAddressRepository;
    private final NESAmMemberRepository memberRepository;
    private final MemberNomineeRepository nomineeRepository;
    private final FeeCalculationService feeCalculationService;

    public InitiateRegistrationResponse initiate(String email) {
        Optional<NESAmApplication> pending = applicationRepository.findFirstByEmailIdAndStatusOrderByStartedAtDesc(email, ApplicationStatus.STARTED);
        if (pending.isPresent()) {
            return new InitiateRegistrationResponse(
                RegistrationStatus.PENDING_APPLICATION,
                pending.get().getApplicationId(),
                pending.get().getStartedAt(),
                "You have an application in progress. You can resume where you left off or start a fresh application."
            );
        }

        Optional<AaAlumniMaster> alumniOpt = alumniRepository.findByEmailId(email);
        if (alumniOpt.isEmpty()) {
            return new InitiateRegistrationResponse(RegistrationStatus.NOT_FOUND, null, null,
                "Alumni Record Not Found. We could not find your details in the Alumni database. Please register with the Alumni Association first. If you recently updated your details, please try again later or contact support.");
        }

        AaAlumniMaster alumni = alumniOpt.get();
        if (AaAlumniMembershipType.REGISTERED.equals(alumni.getMembershipType())) {
            return new InitiateRegistrationResponse(RegistrationStatus.NOT_A_MEMBER, null, null,
                "Association Membership Required. Your alumni record exists but you are not yet a Life or Patron member of the association. Please contact the Alumni Association to upgrade your membership.");
        }

        return new InitiateRegistrationResponse(RegistrationStatus.ELIGIBLE, null, null,
            "You are eligible. A verification code will be sent to your email.");
    }

    public PrefillResponse prefill(String email) {
        Optional<NESAmApplication> app = applicationRepository.findFirstByEmailIdAndStatusOrderByStartedAtDesc(email, ApplicationStatus.STARTED);
        
        String source = app.isPresent() ? "PENDING_APPLICATION" : "ALUMNI_MASTER";
        UUID applicationId = app.map(NESAmApplication::getApplicationId).orElse(null);
        
        NESAmApplicationDetail savedDetails = null;
        if (applicationId != null) {
            savedDetails = applicationDetailsRepository.findById(applicationId).orElse(null);
        }

        AaAlumniMaster alumni = alumniRepository.findByEmailId(email)
            .orElseThrow(() -> new RegistrationException("Alumni record not found"));

        boolean isFounding = feeCalculationService.computeIsFounding();
        boolean isPatron = AaAlumniMembershipType.PATRON.equals(alumni.getMembershipType());

        PrefillResponse.AlumniInfo alumniInfo = new PrefillResponse.AlumniInfo(
            alumni.getFullName(), alumni.getEmailId(), alumni.getGraduatingYear(),
            alumni.getStream(), isPatron, isFounding
        );

        PrefillResponse.SavedContact savedContact = null;
        PrefillResponse.SavedNominee savedNominee = null;
        LocalDate savedDob = alumni.getDateOfBirth();
        String savedGen = alumni.getGender();

        if (savedDetails != null) {
            savedContact = new PrefillResponse.SavedContact(
                savedDetails.getMobile(), savedDetails.getLine1(), savedDetails.getLine2(),
                savedDetails.getCity(), savedDetails.getState(), savedDetails.getPostalCode(), savedDetails.getCountry()
            );
            savedNominee = new PrefillResponse.SavedNominee(
                savedDetails.getNomineeName(), 
                savedDetails.getNomineeRelationship() != null ? savedDetails.getNomineeRelationship().name() : null,
                savedDetails.getNomineeEmail(), savedDetails.getNomineeMobile()
            );
            if (savedDetails.getDateOfBirth() != null) savedDob = savedDetails.getDateOfBirth();
        }

        return new PrefillResponse(source, applicationId, alumniInfo, savedContact, savedDob, savedGen, savedNominee);
    }

    public SaveDetailsResponse saveDetails(SaveDetailsRequest request, String email) {
        NESAmApplication application;
        if (request.applicationId() != null) {
            application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new RegistrationException("Application not found"));
            if (!application.getEmailId().equals(email)) {
                throw new RegistrationException("Application does not belong to authenticated user");
            }
        } else {
            NESAmApplication newApplication = new NESAmApplication();
            newApplication.setEmailId(email);
            newApplication.setStatus(ApplicationStatus.STARTED);
            newApplication.setStartedAt(Instant.now());
            alumniRepository.findByEmailId(email).ifPresent(alumni -> newApplication.setAaAlumniId(alumni.getAaAlumniId()));
            application = applicationRepository.save(newApplication);
        }

        final UUID finalAppId = application.getApplicationId();
        NESAmApplicationDetail details = applicationDetailsRepository
            .findById(finalAppId)
            .orElseGet(() -> new NESAmApplicationDetail(finalAppId));

        if (request.mobile() != null) details.setMobile(request.mobile());
        if (request.line1() != null) details.setLine1(request.line1());
        if (request.line2() != null) details.setLine2(request.line2());
        if (request.city() != null) details.setCity(request.city());
        if (request.state() != null) details.setState(request.state());
        if (request.postalCode() != null) details.setPostalCode(request.postalCode());
        if (request.country() != null) details.setCountry(request.country());
        if (request.dateOfBirth() != null) details.setDateOfBirth(request.dateOfBirth());
        if (request.nomineeName() != null) details.setNomineeName(request.nomineeName());
        if (request.nomineeRelationship() != null) details.setNomineeRelationship(NomineeRelationship.valueOf(request.nomineeRelationship().toUpperCase()));
        if (request.nomineeEmail() != null) details.setNomineeEmail(request.nomineeEmail());
        if (request.nomineeMobile() != null) details.setNomineeMobile(request.nomineeMobile());

        applicationDetailsRepository.save(details);

        return new SaveDetailsResponse(application.getApplicationId(), "STARTED", Instant.now());
    }

    @Transactional
    public SubmitResponse submit(UUID applicationId, SubmitApplicationRequest request, String email) {
        NESAmApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RegistrationException("Application not found"));
        if (!application.getEmailId().equals(email))
            throw new RegistrationException("Application does not belong to authenticated user");
        if (application.getStatus() == ApplicationStatus.COMPLETED)
            throw new RegistrationException("Application already submitted");

        NESAmApplicationDetail details = applicationDetailsRepository.findById(applicationId)
            .orElseThrow(() -> new RegistrationException("Application details not found"));

        if (details.getDateOfBirth() == null) {
            throw new RegistrationException("Applicant strictly lacks a DateOfBirth");
        }
        int age = Period.between(details.getDateOfBirth(), LocalDate.now()).getYears();
        if (age >= 60) throw new RegistrationException("Applicant must be under 60 years old");


        AaAlumniMaster alumni = alumniRepository.findByEmailId(email).orElseThrow();
        
        // Ensure User
        NESAmUser user = userRepository.findByEmail(email).orElseGet(() -> {
            NESAmUser newUser = new NESAmUser();
            newUser.setAaAlumniId(alumni.getAaAlumniId());
            newUser.setFullName(alumni.getFullName());
            newUser.setEmail(email);
            newUser.setMobile(details.getMobile());
            if (alumni.getGender() != null) newUser.setGender(alumni.getGender());
            newUser.setDateOfBirth(details.getDateOfBirth());
            newUser.setGraduatingYear(alumni.getGraduatingYear());
            newUser.setStatus(NesamUserStatus.ACTIVE);
            return userRepository.save(newUser);
        });

        // Ensure Address
        NESAmUserAddress address = new NESAmUserAddress();
        address.setNesamUserId(user.getNesamUserId());
        address.setAddressType(AddressType.CORRESPONDENCE);
        address.setLine1(details.getLine1());
        address.setLine2(details.getLine2());
        address.setCity(details.getCity());
        address.setState(details.getState());
        address.setPostalCode(details.getPostalCode());
        address.setCountry(details.getCountry());
        userAddressRepository.save(address);

        // Compute Free and Tier
        FeePreviewResponse fee = feeCalculationService.calculate(details.getDateOfBirth(), email);

        // App complete
        application.setStatus(ApplicationStatus.COMPLETED);
        application.setCompletedAt(Instant.now());
        applicationRepository.save(application);

        // Record mock payment
        NESAmApplicationPayment payment = new NESAmApplicationPayment();
        payment.setApplicationId(applicationId);
        payment.setAmount(fee.totalPayable());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentGateway("MOCK");
        payment.setGatewayReference(request.paymentReference());
        payment.setInitiatedAt(Instant.now());
        payment.setCompletedAt(Instant.now());
        applicationPaymentRepository.save(payment);

        String membershipNumber = "NES-" + LocalDate.now().getYear() + "-" + String.format("%03d", memberRepository.count() + 1);

        NESAmMember member = new NESAmMember();
        member.setApplicationId(applicationId);
        member.setNesamUserId(user.getNesamUserId());
        member.setNesamId(membershipNumber);
        member.setMembershipType(MembershipTier.valueOf(fee.tierApplied()));
        member.setJoinedDate(LocalDate.now());
        NESAmMember savedMember = memberRepository.save(member);

        // Assign 100% share to the single primary nominee provided during the application details stage
        if (details.getNomineeName() != null && !details.getNomineeName().isEmpty()) {
            MemberNominee nominee = new MemberNominee();
            nominee.setNesamMemberId(savedMember.getNesamMemberId());
            nominee.setNomineeName(details.getNomineeName());
            nominee.setRelationship(details.getNomineeRelationship());
            nominee.setSharePercentage(new BigDecimal("100.00"));
            nomineeRepository.save(nominee);
        }

        return new SubmitResponse(true, membershipNumber, "ACTIVE", fee.tierApplied(), fee.totalPayable(),
            "Welcome to NESAm! Your membership " + membershipNumber + " is now active.");
    }
}
