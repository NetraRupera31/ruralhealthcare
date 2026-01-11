package com.healthcare.api.service;

import com.healthcare.api.dto.AnalyticsResponse;
import com.healthcare.api.model.Patient;
import com.healthcare.api.repository.PatientRepository;
import com.healthcare.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PatientRepository patientRepository;
    private final JwtUtil jwtUtil;

    public AnalyticsResponse getDashboardAnalytics(String token) {
        Long doctorId = jwtUtil.getUserIdFromToken(token);
        List<Patient> patients = patientRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);

        int totalPatients = patients.size();
        int highRiskPatients = (int) patients.stream().filter(p -> "high".equalsIgnoreCase(p.getRiskLevel())).count();
        int mediumRiskPatients = (int) patients.stream().filter(p -> "medium".equalsIgnoreCase(p.getRiskLevel())).count();
        int lowRiskPatients = (int) patients.stream().filter(p -> "low".equalsIgnoreCase(p.getRiskLevel())).count();

        // Disease distribution
        Map<String, Integer> diseaseDistribution = patients.stream()
                .filter(p -> p.getDisease() != null && !p.getDisease().isEmpty())
                .collect(Collectors.groupingBy(Patient::getDisease, Collectors.summingInt(p -> 1)));

        // Risk trends
        Map<String, Integer> riskTrends = new HashMap<>();
        riskTrends.put("high", highRiskPatients);
        riskTrends.put("medium", mediumRiskPatients);
        riskTrends.put("low", lowRiskPatients);

        return new AnalyticsResponse(
                totalPatients,
                highRiskPatients,
                mediumRiskPatients,
                lowRiskPatients,
                diseaseDistribution,
                riskTrends
        );
    }
}
