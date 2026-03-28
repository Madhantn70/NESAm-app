package org.irtt.nesam.shared.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtils {
    private DateUtils() {}
    public static String formatDefault(LocalDateTime dateTime) {
        if(dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
