package org.irtt.nesam.infrastructure.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TwilioSmsService implements SmsService {

    @Override
    public void sendOtp(String to, String message) {
        // Implement real Twilio SDK integration here
        log.info("Mock Twilio: Sent SMS to {} with message: {}", to, message);
    }
}
