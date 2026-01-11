package com.healthcare.api.controller;

import com.healthcare.api.dto.*;
import com.healthcare.api.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(
            @RequestHeader("Authorization") String token,
            @RequestBody PatientRequest request) {
        String jwt = token.replace("Bearer ", "");
        return ResponseEntity.ok(patientService.createPatient(jwt, request));
    }

    @GetMapping
    public ResponseEntity<List<PatientResponse>> getPatients(
            @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        return ResponseEntity.ok(patientService.getPatientsByDoctor(jwt));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatient(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        String jwt = token.replace("Bearer ", "");
        return ResponseEntity.ok(patientService.getPatient(jwt, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponse> updatePatient(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody PatientRequest request) {
        String jwt = token.replace("Bearer ", "");
        return ResponseEntity.ok(patientService.updatePatient(jwt, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePatient(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        String jwt = token.replace("Bearer ", "");
        patientService.deletePatient(jwt, id);
        return ResponseEntity.ok(new MessageResponse("Patient deleted successfully"));
    }
}
