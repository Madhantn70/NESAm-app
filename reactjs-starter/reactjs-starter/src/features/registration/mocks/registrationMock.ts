import {
  RegistrationVerifyEmailRequest,
  RegistrationVerifyEmailResponse,
  RegistrationVerifyOTPRequest,
  RegistrationVerifyOTPResponse,
  RegistrationSubmitRequest,
  RegistrationSubmitResponse,
} from "../models/api/registration";

// Utility function for delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockRegistrationApi = {
  verifyEmail: async (
    req: RegistrationVerifyEmailRequest
  ): Promise<RegistrationVerifyEmailResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emailPrefix = req.email.split("@")[0].toLowerCase();
        if (emailPrefix === "notfound") return resolve({ status: "not_found" });
        if (emailPrefix === "pending") return resolve({ status: "pending" });
        if (emailPrefix === "resume") return resolve({ status: "resume" });

        const isPatron = emailPrefix.includes("patron");
        const isFounding = emailPrefix.includes("founding");

        resolve({
          status: "verified",
          alumniData: {
            name: emailPrefix === "life" ? "Life Member" : "John Doe",
            batch: "2015",
            department: "Computer Science",
            email: req.email,
            isPatron,
            isFounding
          },
        });
      }, 1000);
    });
  },

  verifyOtp: async (req: RegistrationVerifyOTPRequest): Promise<RegistrationVerifyOTPResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (req.otp === "123456") {
          resolve({ success: true });
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 1000);
    });
  },

  submitDetails: async (
    req: RegistrationSubmitRequest
  ): Promise<RegistrationSubmitResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, registrationId: "NESAM-" + Date.now() });
      }, 1200);
    });
  },
};
