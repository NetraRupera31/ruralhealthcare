package com.healthcare.api.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier; // email or medicalId
    private String password;
}
