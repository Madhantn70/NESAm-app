import { useState, useCallback } from "react";
import { registrationApi } from "../api/registrationApi";
import { mapAlumniResponseToView } from "../mappers/registrationMapper";
import {
  RegistrationStep,
  RegistrationFormData,
  defaultRegistrationForm,
  AlumniViewData,
} from "../models/view/registration";

import { useNavigate } from "react-router-dom";

export const useRegistrationViewModel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>(RegistrationStep.ENTER_EMAIL);
  const [formData, setFormData] = useState<RegistrationFormData>(defaultRegistrationForm);
  const [alumniData, setAlumniData] = useState<AlumniViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);

  const updateFormData = useCallback((key: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const nextStep = useCallback(() => {
    setError(null);
    setStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setError(null);
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const setExplicitStep = useCallback((targetStep: RegistrationStep) => {
    setError(null);
    setStep(targetStep);
  }, []);

  const handleVerify = useCallback(async (email: string) => {
    if (loading) return; 
    
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await registrationApi.verifyEmail({ email });
      // Axios unwrap: response is already the { success, data, message } object
      if (response.success && response.data) {
        setAlumniData(response.data);
        setStep(RegistrationStep.VERIFIED_ALUMNI);
        setSuccessStatus("Email verified! Welcome back.");
      } else {
        setError(response.message || "Alumni not found in our records");
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleRequestOtp = useCallback(async (mobile: string) => {
    if (loading) return;
    if (mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await registrationApi.requestOtt({ mobile });
      if (response.success) {
        setExplicitStep(RegistrationStep.ENTER_OTP);
        setSuccessStatus("Token sent! Please check your device.");
      } else {
        setError(response.message || "Failed to send token");
      }
    } catch (err: any) {
      setError("Secure token request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, setExplicitStep]);

  const handleVerifyOtp = useCallback(async (token: string) => {
    if (loading) return;
    if (!token) {
      setError("Please enter the token");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await registrationApi.loginWithOtt({ token });
      if (response.success && response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/dashboard");
      } else {
        setError(response.message || "Invalid or expired token");
      }
    } catch (err: any) {
      setError("Authentication failed. Please check your token.");
    } finally {
      setLoading(false);
    }
  }, [loading, navigate]);

  const handlePayOnline = useCallback(async () => {
    if (loading) return;
    
    setError(null);
    setLoading(true);
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

      if (response.success && response.data?.registrationId) {
        setSuccessStatus("Registration complete!");
        setStep(RegistrationStep.PAYMENT_SUCCESS);
      } else {
        setStep(RegistrationStep.PAYMENT_FAILURE);
      }
    } catch (err: any) {
      setError(err?.message || "Final registration failed. Please try again.");
      setStep(RegistrationStep.PAYMENT_FAILURE);
    } finally {
      setLoading(false);
    }
  }, [loading, formData]);

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
    handleVerify,
    handleRequestOtp,
    handleVerifyOtp,
    handlePayOnline,
    setError,
    clearSuccess: () => setSuccessStatus(null),
  };
};
