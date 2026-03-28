package org.irtt.nesam.infrastructure.sms;

public interface SmsGateway {
    void sendSms(String mobileNumber, String message);
}
