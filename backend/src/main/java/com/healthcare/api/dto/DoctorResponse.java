package com.healthcare.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorResponse {
    private Long id;
    private String name;
    private String email;
    private String medicalId;
    private String hospital;
    private String hospitalPhone;
    private String specialization;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
