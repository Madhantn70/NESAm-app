package org.irtt.nesam.infrastructure.sms;

public interface SmsService {
    void sendOtp(String to, String message);
}
