package org.irtt.nesam.shared.exception;

import lombok.Getter;

@Getter
public class NESAmException extends RuntimeException {
    
    private final String code;
    
    public NESAmException(String code, String message) {
        super(message);
        this.code = code;
    }
}
