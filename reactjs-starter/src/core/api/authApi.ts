import { USE_MOCK } from "@/shared/constants/config";
import { authMock } from "@/domains/public/login/mocks/authMock";
import { LoginRequest, VerifyOTPRequest, AuthResponse } from "@/domains/public/login/models/api/auth";

export const authApi = {
  login: async (request: LoginRequest): Promise<{ success: boolean }> => {
    if (USE_MOCK) {
      return authMock.login(request.email);
    }
    // Placeholder for real axios call
    throw new Error("Real API not implemented yet");
  },

  verifyOtp: async (request: VerifyOTPRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      const result = await authMock.verifyOtp(request.email, request.otp);
      return { token: result.token };
    }
    // Placeholder for real axios call
    throw new Error("Real API not implemented yet");
  }
};
