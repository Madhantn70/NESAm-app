export const authMock = {
  login: async (email: string) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      setTimeout(() => {
        if (email === "notfound@nesam.com") reject(new Error("Not found"));
        resolve({ success: true });
      }, 500);
    });
  },
  verifyOtp: async (email: string, otp: string) => {
    return new Promise<{ token: string }>((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") resolve({ token: "fake-jwt-token" });
        else reject(new Error("Invalid OTP"));
      }, 500);
    });
  }
};
