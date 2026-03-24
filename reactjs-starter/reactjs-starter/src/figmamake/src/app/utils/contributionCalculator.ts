/**
 * NESAm Official Contribution Structure
 * 
 * This file contains the official financial logic for NESAm membership and DFC contributions.
 * All monetary calculations across the app must use these utilities to ensure consistency.
 */

export interface AgeBandSlab {
  minAge: number;
  maxAge: number;
  label: string;
  membershipFee: number;
  dfcPerEvent: number;
  advanceDFC: number; // Always 5 × dfcPerEvent
  totalAtJoining: number; // membershipFee + advanceDFC (before discounts)
}

/**
 * Official Age Band Slabs
 * These are the authoritative contribution amounts for NESAm
 */
export const AGE_BAND_SLABS: AgeBandSlab[] = [
  {
    minAge: 0,
    maxAge: 25,
    label: "Up to 25 years",
    membershipFee: 2000,
    dfcPerEvent: 100,
    advanceDFC: 500,
    totalAtJoining: 2500,
  },
  {
    minAge: 26,
    maxAge: 30,
    label: "26–30 years",
    membershipFee: 3500,
    dfcPerEvent: 200,
    advanceDFC: 1000,
    totalAtJoining: 4500,
  },
  {
    minAge: 31,
    maxAge: 35,
    label: "31–35 years",
    membershipFee: 5000,
    dfcPerEvent: 400,
    advanceDFC: 2000,
    totalAtJoining: 7000,
  },
  {
    minAge: 36,
    maxAge: 40,
    label: "36–40 years",
    membershipFee: 7000,
    dfcPerEvent: 500,
    advanceDFC: 2500,
    totalAtJoining: 9500,
  },
  {
    minAge: 41,
    maxAge: 45,
    label: "41–45 years",
    membershipFee: 9000,
    dfcPerEvent: 500,
    advanceDFC: 2500,
    totalAtJoining: 11500,
  },
  {
    minAge: 46,
    maxAge: 50,
    label: "46–50 years",
    membershipFee: 11500,
    dfcPerEvent: 500,
    advanceDFC: 2500,
    totalAtJoining: 14000,
  },
  {
    minAge: 51,
    maxAge: 55,
    label: "51–55 years",
    membershipFee: 14000,
    dfcPerEvent: 500,
    advanceDFC: 2500,
    totalAtJoining: 16500,
  },
  {
    minAge: 56,
    maxAge: 60,
    label: "56–60 years",
    membershipFee: 16500,
    dfcPerEvent: 500,
    advanceDFC: 2500,
    totalAtJoining: 19000,
  },
];

/**
 * Membership Types with Discount Rules
 * Discounts apply ONLY to the Membership Fee component, NOT to Advance DFC
 */
export enum MembershipType {
  Regular = "regular",
  Patron = "patron",
  Founding = "founding",
  PatronFounding = "patron-founding",
}

export interface MembershipDiscount {
  type: MembershipType;
  label: string;
  discountPercent: number;
}

export const MEMBERSHIP_DISCOUNTS: MembershipDiscount[] = [
  {
    type: MembershipType.Regular,
    label: "Regular Member",
    discountPercent: 0,
  },
  {
    type: MembershipType.Patron,
    label: "Patron Member",
    discountPercent: 5,
  },
  {
    type: MembershipType.Founding,
    label: "Founding Member",
    discountPercent: 10,
  },
  {
    type: MembershipType.PatronFounding,
    label: "Patron + Founding Member",
    discountPercent: 15,
  },
];

/**
 * Get age band slab for a given age
 */
export function getAgeBandSlab(age: number): AgeBandSlab | null {
  const slab = AGE_BAND_SLABS.find(
    (slab) => age >= slab.minAge && age <= slab.maxAge
  );
  return slab || null;
}

/**
 * Calculate discount amount on membership fee
 * Important: Discounts apply ONLY to membership fee, NOT to advance DFC
 */
export function calculateMembershipDiscount(
  membershipFee: number,
  membershipType: MembershipType
): number {
  const discount = MEMBERSHIP_DISCOUNTS.find((d) => d.type === membershipType);
  if (!discount) return 0;
  return Math.round((membershipFee * discount.discountPercent) / 100);
}

/**
 * Calculate total payable amount at joining
 * Formula: (Membership Fee - Discount) + Advance DFC
 */
export function calculateTotalPayable(
  membershipFee: number,
  advanceDFC: number,
  membershipType: MembershipType
): {
  membershipFee: number;
  discount: number;
  membershipAfterDiscount: number;
  advanceDFC: number;
  total: number;
} {
  const discount = calculateMembershipDiscount(membershipFee, membershipType);
  const membershipAfterDiscount = membershipFee - discount;
  const total = membershipAfterDiscount + advanceDFC;

  return {
    membershipFee,
    discount,
    membershipAfterDiscount,
    advanceDFC,
    total,
  };
}

/**
 * Get discount label for display
 */
export function getDiscountLabel(membershipType: MembershipType): string {
  const discount = MEMBERSHIP_DISCOUNTS.find((d) => d.type === membershipType);
  return discount ? discount.label : "Regular Member";
}

/**
 * Get discount percentage for display
 */
export function getDiscountPercent(membershipType: MembershipType): number {
  const discount = MEMBERSHIP_DISCOUNTS.find((d) => d.type === membershipType);
  return discount ? discount.discountPercent : 0;
}

/**
 * Standard explanation for Advance DFC
 */
export const ADVANCE_DFC_EXPLANATION =
  "Advance DFC covers approximately 5 future DFC events based on your current age slab.";
