import React, { useEffect } from "react";
import { Header } from "@/shared/components/shared/Header";
import { ProgressStepper } from "@/shared/components/shared/ProgressStepper";
import { useRegistrationViewModel } from "@/domains/public/registration/viewModels/useRegistrationViewModel";
import { RegistrationStep } from "@/domains/public/registration/models/view/registration";

import { RegistrationEnterEmail } from "@/domains/public/registration/components/RegistrationEnterEmail";
import { RegistrationOTP } from "@/domains/public/registration/components/RegistrationOTP";
import { RegistrationVerified } from "@/domains/public/registration/components/RegistrationVerified";
import { RegistrationContact } from "@/domains/public/registration/components/RegistrationContact";
import { RegistrationAge } from "@/domains/public/registration/components/RegistrationAge";
import { RegistrationNominee } from "@/domains/public/registration/components/RegistrationNominee";
import { RegistrationSummary } from "@/domains/public/registration/components/RegistrationSummary";

// newly added ones
import { RegistrationNotFound } from "@/domains/public/registration/components/RegistrationNotFound";
import { RegistrationMembershipPending } from "@/domains/public/registration/components/RegistrationMembershipPending";
import { RegistrationResume } from "@/domains/public/registration/components/RegistrationResume";
import { RegistrationAdvanceDFC } from "@/domains/public/registration/components/RegistrationAdvanceDFC";
import { RegistrationMembershipBenefit } from "@/domains/public/registration/components/RegistrationMembershipBenefit";
import { RegistrationPaymentMethod } from "@/domains/public/registration/components/RegistrationPaymentMethod";
import { RegistrationPaymentProcessing } from "@/domains/public/registration/components/RegistrationPaymentProcessing";
import { RegistrationPaymentSuccess } from "@/domains/public/registration/components/RegistrationPaymentSuccess";
import { RegistrationPaymentFailure } from "@/domains/public/registration/components/RegistrationPaymentFailure";

import { calculateTotalPayable, getAgeBandSlab, MembershipType } from "@/shared/utils/contributionCalculator";

export function RegistrationPage() {
  const vm = useRegistrationViewModel();

  // Scroll to top on step change for mobile friendliness
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vm.step]);

  let showStepper = false;
  let stepperIndex = 0;

  if (vm.step >= RegistrationStep.CONTACT_DETAILS && vm.step <= RegistrationStep.PAYMENT_METHOD) {
    showStepper = true;
    if (vm.step === RegistrationStep.CONTACT_DETAILS) stepperIndex = 0;
    else if (vm.step === RegistrationStep.AGE_DETAILS) stepperIndex = 1;
    else if (vm.step === RegistrationStep.NOMINEE_DETAILS) stepperIndex = 2;
    // Step 3 holds all membership benefit & summary derivations BEFORE payment method
    else if (
      vm.step === RegistrationStep.MEMBERSHIP_BENEFIT || 
      vm.step === RegistrationStep.FINAL_SUMMARY || 
      vm.step === RegistrationStep.ADVANCE_DFC_INFO
    ) {
      stepperIndex = 3;
    }
    else if (vm.step === RegistrationStep.PAYMENT_METHOD) {
      stepperIndex = 4;
    }
  }

  const getMembershipType = () => {
    if (vm.alumniData?.isPatron && vm.alumniData?.isFounding) return MembershipType.PatronFounding;
    if (vm.alumniData?.isFounding) return MembershipType.Founding;
    if (vm.alumniData?.isPatron) return MembershipType.Patron;
    return MembershipType.Regular;
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const ageData = vm.formData.dateOfBirth ? getAgeBandSlab(calculateAge(vm.formData.dateOfBirth)) : null;
  const memType = getMembershipType();
  const calcData = calculateTotalPayable(ageData?.membershipFee || 0, ageData?.advanceDFC || 0, memType);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {showStepper && <ProgressStepper currentStep={stepperIndex} />}

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center">
        {vm.step === RegistrationStep.ENTER_EMAIL && (
          <RegistrationEnterEmail
            email={vm.formData.email}
            updateEmail={(val) => vm.updateFormData("email", val)}
            onVerify={vm.handleVerifyEmail}
            loading={vm.loading}
            error={vm.error}
          />
        )}
        
        {vm.step === RegistrationStep.ENTER_OTP && (
          <RegistrationOTP
            email={vm.formData.email}
            otp={vm.formData.otp}
            updateOtp={(val) => vm.updateFormData("otp", val)}
            onVerify={vm.handleVerifyOtp}
            loading={vm.loading}
            error={vm.error}
          />
        )}

        {vm.step === RegistrationStep.NOT_FOUND && (
          <RegistrationNotFound onBack={() => vm.setExplicitStep(RegistrationStep.ENTER_EMAIL)} />
        )}

        {vm.step === RegistrationStep.MEMBERSHIP_PENDING && (
          <RegistrationMembershipPending onAlreadyPaid={() => vm.setExplicitStep(RegistrationStep.ENTER_EMAIL)} />
        )}

        {vm.step === RegistrationStep.RESUME_REGISTRATION && (
          <RegistrationResume onContinue={() => vm.setExplicitStep(RegistrationStep.CONTACT_DETAILS)} />
        )}

        {vm.step === RegistrationStep.VERIFIED_ALUMNI && (
          <RegistrationVerified
            alumniData={vm.alumniData}
            onContinue={() => vm.setExplicitStep(RegistrationStep.CONTACT_DETAILS)}
            onTryAnother={() => {
              vm.updateFormData("email", "");
              vm.setExplicitStep(RegistrationStep.ENTER_EMAIL);
            }}
          />
        )}

        {vm.step === RegistrationStep.CONTACT_DETAILS && (
          <RegistrationContact
            formData={vm.formData}
            updateData={vm.updateFormData}
            onNext={() => vm.setExplicitStep(RegistrationStep.AGE_DETAILS)}
          />
        )}

        {vm.step === RegistrationStep.AGE_DETAILS && (
          <RegistrationAge
             formData={vm.formData}
             updateData={vm.updateFormData}
             onNext={() => vm.setExplicitStep(RegistrationStep.NOMINEE_DETAILS)}
          />
        )}

        {vm.step === RegistrationStep.NOMINEE_DETAILS && (
          <RegistrationNominee
             formData={vm.formData}
             updateData={vm.updateFormData}
             onNext={() => vm.setExplicitStep(RegistrationStep.MEMBERSHIP_BENEFIT)}
          />
        )}

        {vm.step === RegistrationStep.MEMBERSHIP_BENEFIT && (
          <RegistrationMembershipBenefit
             membershipType={memType}
             membershipFee={ageData?.membershipFee || 0}
             advanceDFC={ageData?.advanceDFC || 0}
             onContinue={() => vm.setExplicitStep(RegistrationStep.FINAL_SUMMARY)}
          />
        )}

        {vm.step === RegistrationStep.FINAL_SUMMARY && (
          <RegistrationSummary
             formData={vm.formData}
             onSubmit={() => vm.setExplicitStep(RegistrationStep.PAYMENT_METHOD)}
             onGoBackToAge={() => vm.setExplicitStep(RegistrationStep.AGE_DETAILS)}
             loading={vm.loading}
             error={vm.error}
          />
        )}

        {vm.step === RegistrationStep.ADVANCE_DFC_INFO && (
          <RegistrationAdvanceDFC
            onBackToSummary={() => vm.setExplicitStep(RegistrationStep.FINAL_SUMMARY)}
          />
        )}

        {vm.step === RegistrationStep.PAYMENT_METHOD && (
          <RegistrationPaymentMethod
             totalPayable={calcData.total}
             onPayOnline={vm.handlePayOnline}
          />
        )}

        {vm.step === RegistrationStep.PAYMENT_PROCESSING && (
          <RegistrationPaymentProcessing />
        )}

        {vm.step === RegistrationStep.PAYMENT_SUCCESS && (
          <RegistrationPaymentSuccess 
             totalPaid={calcData.total}
             membershipPaid={calcData.membershipAfterDiscount}
             advanceDFCPaid={calcData.advanceDFC}
             transactionRef={`TXN-${Date.now()}`}
             memberNumber={vm.successStatus || "Pending"}
             onGoToDashboard={() => window.location.href = '/member'}
          />
        )}

        {vm.step === RegistrationStep.PAYMENT_FAILURE && (
          <RegistrationPaymentFailure
             onRetryPayment={() => vm.setExplicitStep(RegistrationStep.PAYMENT_METHOD)}
          />
        )}
      </main>
    </div>
  );
}
