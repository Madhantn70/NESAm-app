package org.irtt.nesam.services;

public class AlumniNotFoundException extends RuntimeException {
    public AlumniNotFoundException(String message) {
        super(message);
    }
}
