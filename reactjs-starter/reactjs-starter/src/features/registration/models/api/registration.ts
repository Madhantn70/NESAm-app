export interface RegistrationVerifyEmailRequest {
  email: string;
}

export interface AlumniDataResponse {
  name: string;
  batch: string;
  department: string;
  email: string;
  isPatron?: boolean;
  isFounding?: boolean;
}

export interface RegistrationVerifyEmailResponse {
  status: "verified" | "not_found" | "pending" | "resume";
  alumniData?: AlumniDataResponse;
}

export interface RegistrationVerifyOTPRequest {
  email: string;
  otp: string;
}

export interface RegistrationVerifyOTPResponse {
  success: boolean;
}

export interface RegistrationSubmitRequest {
  email: string;
  contactData: {
    mobile: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  ageData: {
    dateOfBirth: string;
  };
  nomineeData: {
    name: string;
    relationship: string;
    mobile: string;
    email: string;
  };
  membershipType: string;
}

export interface RegistrationSubmitResponse {
  success: boolean;
  registrationId: string;
}
