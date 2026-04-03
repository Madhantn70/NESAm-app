export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

export interface RegistrationVerifyEmailRequest {
  email: string;
}

export interface AlumniDataResponse {
  name: string;
  batch: number;
  department: string;
  email: string;
  isPatron?: boolean;
  isFounding?: boolean;
}

export interface RegistrationVerifyOTPRequest {
  email: string;
  otp: string;
}

export interface RegistrationOttRequest {
  mobile: string;
}

export interface RegistrationLoginRequest {
  token: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
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

export interface RegistrationSubmitResponseData {
  registrationId: string;
}
