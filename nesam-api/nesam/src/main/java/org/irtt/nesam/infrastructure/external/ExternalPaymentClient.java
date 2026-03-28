package org.irtt.nesam.infrastructure.external;

public interface ExternalPaymentClient {
    boolean verifyPayment(String referenceId);
}
