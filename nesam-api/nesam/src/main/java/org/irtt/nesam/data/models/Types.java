package org.irtt.nesam.data.models;

public class Types {
    public enum MembershipStatus { PENDING, ACTIVE, NOTICE_PERIOD, LAPSED, DECEASED }
    public enum GenderType { MALE, FEMALE, OTHER }
    public enum MembershipCategory { REGULAR, PATRON }
    public enum TransactionType { CREDIT, DEBIT, DEMAND }
    public enum TransactionCategory { MEMBERSHIP_FEE, SECURITY_DEPOSIT_TOPUP, DFC_CONTRIBUTION, DEPOSIT_ADJUSTMENT, REFUND }
    public enum TransactionStatus { INITIATED, SUCCESS, FAILED, PENDING, OVERDUE }
}
