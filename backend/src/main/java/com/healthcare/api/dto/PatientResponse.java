package com.healthcare.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientResponse {
    private Long id;
    private Long doctorId;
    private String name;
    private Integer age;
    private String gender;
    private String phone;
    private String familyPhone;
    private String state;
    private String city;
    private Double weight;
    private Double height;
    private Double temperature;
    private String bloodPressure;
    private Double oxygen;
    private Integer pulse;
    private List<String> symptoms;
    private String voiceSymptoms;
    private String riskLevel;
    private String disease;
    private List<String> triggers;
    private List<String> recommendations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
