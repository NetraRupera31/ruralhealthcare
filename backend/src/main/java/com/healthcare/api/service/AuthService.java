package com.healthcare.api.service;

import com.healthcare.api.dto.*;
import com.healthcare.api.model.Doctor;
import com.healthcare.api.repository.DoctorRepository;
import com.healthcare.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final DoctorRepository doctorRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        // Check if doctor already exists
        if (doctorRepository.findByEmailOrMedicalId(request.getEmail(), request.getMedicalId()).isPresent()) {
            throw new RuntimeException("Doctor with this email or medical ID already exists");
        }

        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setMedicalId(request.getMedicalId());
        doctor.setHospital(request.getHospital());
        doctor.setHospitalPhone(request.getHospitalPhone());
        doctor.setSpecialization(request.getSpecialization());

        Doctor savedDoctor = doctorRepository.save(doctor);

        String token = jwtUtil.generateToken(savedDoctor.getId(), savedDoctor.getEmail());

        return new AuthResponse(token, mapToDoctorResponse(savedDoctor));
    }

    public AuthResponse login(LoginRequest request) {
        // Security disabled - ANY email/password combination works
        // Check if doctor exists, if not create a temporary one
        Doctor doctor = doctorRepository.findByEmailOrMedicalId(request.getIdentifier(), request.getIdentifier())
                .orElseGet(() -> {
                    // Create a new doctor on-the-fly if not exists
                    Doctor newDoctor = new Doctor();
                    newDoctor.setName("Dr. " + request.getIdentifier());
                    newDoctor.setEmail(request.getIdentifier().contains("@") ? request.getIdentifier() : request.getIdentifier() + "@temp.com");
                    newDoctor.setPassword("temp"); // No encryption needed
                    newDoctor.setMedicalId(request.getIdentifier());
                    newDoctor.setHospital("Default Hospital");
                    newDoctor.setHospitalPhone("0000000000");
                    newDoctor.setSpecialization("General");
                    return doctorRepository.save(newDoctor);
                });

        // Update last login
        doctor.setLastLogin(LocalDateTime.now());
        doctorRepository.save(doctor);

        String token = jwtUtil.generateToken(doctor.getId(), doctor.getEmail());

        return new AuthResponse(token, mapToDoctorResponse(doctor));
    }

    public DoctorResponse getCurrentDoctor(String token) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return mapToDoctorResponse(doctor);
    }

    private DoctorResponse mapToDoctorResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getMedicalId(),
                doctor.getHospital(),
                doctor.getHospitalPhone(),
                doctor.getSpecialization(),
                doctor.getCreatedAt(),
                doctor.getLastLogin()
        );
    }
}
