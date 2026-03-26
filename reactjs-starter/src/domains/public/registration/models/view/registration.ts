import { MembershipType } from "@/shared/utils/contributionCalculator";

export enum RegistrationStep {
  ENTER_EMAIL = 0,
  NOT_FOUND = 1,
  MEMBERSHIP_PENDING = 2,
  RESUME_REGISTRATION = 3,
  ENTER_OTP = 4,
  VERIFIED_ALUMNI = 5,
  CONTACT_DETAILS = 6,
  AGE_DETAILS = 7,
  NOMINEE_DETAILS = 8,
  MEMBERSHIP_BENEFIT = 9,
  FINAL_SUMMARY = 10,
  ADVANCE_DFC_INFO = 11,
  PAYMENT_METHOD = 12,
  PAYMENT_PROCESSING = 13,
  PAYMENT_SUCCESS = 14,
  PAYMENT_FAILURE = 15,
}

export interface AlumniViewData {
  name: string;
  batch: string;
  department: string;
  email: string;
  isPatron?: boolean;
  isFounding?: boolean;
}

export interface RegistrationFormData {
  email: string;
  otp: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  dateOfBirth: string;
  nomineeName: string;
  relationship: string;
  nomineeMobile: string;
  nomineeEmail: string;
  membershipType: MembershipType;
}

export const defaultRegistrationForm: RegistrationFormData = {
  email: "",
  otp: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
  dateOfBirth: "",
  nomineeName: "",
  relationship: "",
  nomineeMobile: "",
  nomineeEmail: "",
  membershipType: MembershipType.PatronFounding, // Default example
};
