package com.healthcare.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponse {
    private int totalPatients;
    private int highRiskPatients;
    private int mediumRiskPatients;
    private int lowRiskPatients;
    private Map<String, Integer> diseaseDistribution;
    private Map<String, Integer> riskTrends;
}
