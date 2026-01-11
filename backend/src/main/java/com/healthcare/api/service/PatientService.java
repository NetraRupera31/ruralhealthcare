package com.healthcare.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.api.dto.PatientRequest;
import com.healthcare.api.dto.PatientResponse;
import com.healthcare.api.model.Patient;
import com.healthcare.api.repository.PatientRepository;
import com.healthcare.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PatientResponse createPatient(String token, PatientRequest request) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);

        Patient patient = new Patient();
        patient.setDoctorId(doctorId);
        patient.setName(request.getName() != null ? request.getName() : "Unknown");
        patient.setAge(request.getAge() != null ? request.getAge() : 0);
        patient.setGender(request.getGender() != null ? request.getGender() : "Unknown");
        patient.setPhone(request.getPhone() != null ? request.getPhone() : "0000000000");
        patient.setFamilyPhone(request.getFamilyPhone());
        patient.setState(request.getState() != null ? request.getState() : "Unknown");
        patient.setCity(request.getCity() != null ? request.getCity() : "Unknown");
        patient.setWeight(request.getWeight());
        patient.setHeight(request.getHeight());
        patient.setTemperature(request.getTemperature());
        patient.setBloodPressure(request.getBloodPressure());
        patient.setOxygen(request.getOxygen());
        patient.setPulse(request.getPulse());
        patient.setSymptoms(convertListToJson(request.getSymptoms()));
        patient.setVoiceSymptoms(request.getVoiceSymptoms());
        patient.setRiskLevel(request.getRiskLevel());
        patient.setDisease(request.getDisease());
        patient.setTriggers(convertListToJson(request.getTriggers()));
        patient.setRecommendations(convertListToJson(request.getRecommendations()));

        Patient savedPatient = patientRepository.save(patient);

        return mapToPatientResponse(savedPatient);
    }

    public List<PatientResponse> getPatientsByDoctor(String token) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);
        List<Patient> patients = patientRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);

        return patients.stream()
                .map(this::mapToPatientResponse)
                .collect(Collectors.toList());
    }

    public PatientResponse getPatient(String token, Long patientId) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!patient.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized access to patient data");
        }

        return mapToPatientResponse(patient);
    }

    public PatientResponse updatePatient(String token, Long patientId, PatientRequest request) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!patient.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized access to patient data");
        }

        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setFamilyPhone(request.getFamilyPhone());
        patient.setState(request.getState());
        patient.setCity(request.getCity());
        patient.setWeight(request.getWeight());
        patient.setHeight(request.getHeight());
        patient.setTemperature(request.getTemperature());
        patient.setBloodPressure(request.getBloodPressure());
        patient.setOxygen(request.getOxygen());
        patient.setPulse(request.getPulse());
        patient.setSymptoms(convertListToJson(request.getSymptoms()));
        patient.setVoiceSymptoms(request.getVoiceSymptoms());
        patient.setRiskLevel(request.getRiskLevel());
        patient.setDisease(request.getDisease());
        patient.setTriggers(convertListToJson(request.getTriggers()));
        patient.setRecommendations(convertListToJson(request.getRecommendations()));

        Patient updatedPatient = patientRepository.save(patient);

        return mapToPatientResponse(updatedPatient);
    }

    public void deletePatient(String token, Long patientId) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!patient.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized access to patient data");
        }

        patientRepository.delete(patient);
    }

    private PatientResponse mapToPatientResponse(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getDoctorId(),
                patient.getName(),
                patient.getAge(),
                patient.getGender(),
                patient.getPhone(),
                patient.getFamilyPhone(),
                patient.getState(),
                patient.getCity(),
                patient.getWeight(),
                patient.getHeight(),
                patient.getTemperature(),
                patient.getBloodPressure(),
                patient.getOxygen(),
                patient.getPulse(),
                convertJsonToList(patient.getSymptoms()),
                patient.getVoiceSymptoms(),
                patient.getRiskLevel(),
                patient.getDisease(),
                convertJsonToList(patient.getTriggers()),
                convertJsonToList(patient.getRecommendations()),
                patient.getCreatedAt(),
                patient.getUpdatedAt()
        );
    }

    private String convertListToJson(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private List<String> convertJsonToList(String json) {
        if (json == null || json.isEmpty()) return List.of();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }
}
