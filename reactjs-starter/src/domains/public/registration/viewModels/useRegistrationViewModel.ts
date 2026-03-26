import { useState } from "react";
import { registrationApi } from "@/domains/public/registration/api/registrationApi";
import { mapAlumniResponseToView } from "@/domains/public/registration/mappers/registrationMapper";
import {
  RegistrationStep,
  RegistrationFormData,
  defaultRegistrationForm,
  AlumniViewData,
} from "@/domains/public/registration/models/view/registration";

export const useRegistrationViewModel = () => {
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.ENTER_EMAIL);
  const [formData, setFormData] = useState<RegistrationFormData>(defaultRegistrationForm);
  const [alumniData, setAlumniData] = useState<AlumniViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);

  const updateFormData = (key: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setError(null);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const setExplicitStep = (targetStep: RegistrationStep) => {
    setError(null);
    setStep(targetStep);
  };

  const handleVerifyEmail = async () => {
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await registrationApi.verifyEmail({ email: formData.email });
      if (response.status === "verified" && response.alumniData) {
        setAlumniData(mapAlumniResponseToView(response.alumniData));
        setExplicitStep(RegistrationStep.ENTER_OTP);
      } else if (response.status === "pending") {
        setStep(RegistrationStep.MEMBERSHIP_PENDING);
      } else if (response.status === "resume") {
        setStep(RegistrationStep.RESUME_REGISTRATION);
      } else {
        setStep(RegistrationStep.NOT_FOUND);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (formData.otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await registrationApi.verifyOtp({
        email: formData.email,
        otp: formData.otp,
      });
      if (response.success) {
        setExplicitStep(RegistrationStep.VERIFIED_ALUMNI);
      }
    } catch (err: any) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOnline = async () => {
    setLoading(true);
    setError(null);
    setStep(RegistrationStep.PAYMENT_PROCESSING);
    
    try {
      const response = await registrationApi.submitDetails({
        email: formData.email,
        contactData: {
          mobile: formData.mobile,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country,
        },
        ageData: {
          dateOfBirth: formData.dateOfBirth,
        },
        nomineeData: {
          name: formData.nomineeName,
          relationship: formData.relationship,
          mobile: formData.nomineeMobile,
          email: formData.nomineeEmail,
        },
        membershipType: formData.membershipType,
      });

      if (response.success) {
        setSuccessStatus(response.registrationId);
        setStep(RegistrationStep.PAYMENT_SUCCESS);
      } else {
        setStep(RegistrationStep.PAYMENT_FAILURE);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to register");
      setStep(RegistrationStep.PAYMENT_FAILURE);
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    formData,
    alumniData,
    loading,
    error,
    successStatus,
    updateFormData,
    nextStep,
    prevStep,
    setExplicitStep,
    handleVerifyEmail,
    handleVerifyOtp,
    handlePayOnline,
    setError,
  };
};
