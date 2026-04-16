package org.irtt.nesam.data.models.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private boolean success;
    private String nesamId;
}
