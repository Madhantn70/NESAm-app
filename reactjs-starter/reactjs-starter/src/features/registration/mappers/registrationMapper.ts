import { AlumniDataResponse } from "../models/api/registration";
import { AlumniViewData } from "../models/view/registration";

export const mapAlumniResponseToView = (
  response?: AlumniDataResponse
): AlumniViewData | null => {
  if (!response) return null;
  return {
    name: response.name,
    batch: response.batch,
    department: response.department,
    email: response.email,
    isPatron: response.isPatron,
    isFounding: response.isFounding,
  };
};

export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return email;
  const [username, domain] = email.split("@");
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  const visibleChars = 2;
  const masked = username.slice(0, visibleChars) + "***" + username.slice(-1);
  return `${masked}@${domain}`;
};
