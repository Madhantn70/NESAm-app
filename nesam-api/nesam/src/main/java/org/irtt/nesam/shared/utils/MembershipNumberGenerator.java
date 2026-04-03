package org.irtt.nesam.shared.utils;

import java.time.Year;
import java.util.concurrent.atomic.AtomicLong;

public final class MembershipNumberGenerator {

    private MembershipNumberGenerator() {}

    // Temporary mock sequence for demonstration.
    // Real implementation would sync against DB / Sequence Generator based on Year.
    private static final AtomicLong sequence = new AtomicLong(1);

    public static String generate() {
        long seq = sequence.getAndIncrement();
        return String.format("NES-%d-%03d", Year.now().getValue(), seq);
    }
}
