package com.healthcare.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column
    private String name;

    @Column
    private Integer age;

    @Column
    private String gender;

    @Column
    private String phone;

    @Column(name = "family_phone")
    private String familyPhone;

    @Column
    private String state;

    @Column
    private String city;

    private Double weight;
    private Double height;
    private Double temperature;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    private Double oxygen;
    private Integer pulse;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "voice_symptoms")
    private String voiceSymptoms;

    @Column(name = "risk_level")
    private String riskLevel;

    private String disease;

    @Column(columnDefinition = "TEXT")
    private String triggers;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
