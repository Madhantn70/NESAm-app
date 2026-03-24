import { USE_MOCK } from "../../../constants/config";
import { mockRegistrationApi } from "../mocks/registrationMock";
import api from "../../../api/axiosInstance";
import {
  RegistrationVerifyEmailRequest,
  RegistrationVerifyEmailResponse,
  RegistrationVerifyOTPRequest,
  RegistrationVerifyOTPResponse,
  RegistrationSubmitRequest,
  RegistrationSubmitResponse,
} from "../models/api/registration";

export const registrationApi = {
  verifyEmail: async (
    req: RegistrationVerifyEmailRequest
  ): Promise<RegistrationVerifyEmailResponse> => {
    if (USE_MOCK) return mockRegistrationApi.verifyEmail(req);
    const response = await api.post("/public/registration/verify-email", req);
    return response.data;
  },

  verifyOtp: async (
    req: RegistrationVerifyOTPRequest
  ): Promise<RegistrationVerifyOTPResponse> => {
    if (USE_MOCK) return mockRegistrationApi.verifyOtp(req);
    const response = await api.post("/public/registration/verify-otp", req);
    return response.data;
  },

  submitDetails: async (
    req: RegistrationSubmitRequest
  ): Promise<RegistrationSubmitResponse> => {
    if (USE_MOCK) return mockRegistrationApi.submitDetails(req);
    const response = await api.post("/public/registration/submit", req);
    return response.data;
  },
};
