package com.healthcare.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class PatientRequest {
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
}
