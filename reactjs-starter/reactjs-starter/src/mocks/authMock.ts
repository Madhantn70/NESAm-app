export const authMock = {
  login: (email: string): Promise<{ success: boolean }> => {
    console.log(`[MOCK] Sending OTP to ${email}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  },
  
  verifyOtp: (email: string, otp: string): Promise<{ token: string }> => {
    console.log(`[MOCK] Verifying OTP ${otp} for ${email}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ token: "mock-jwt-token-123" });
      }, 1000);
    });
  }
};
