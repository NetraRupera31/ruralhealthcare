package com.healthcare.api.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String medicalId;
    private String hospital;
    private String hospitalPhone;
    private String specialization;
}
