package com.healthcare.api.repository;

import com.healthcare.api.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByMedicalId(String medicalId);
    Optional<Doctor> findByEmailOrMedicalId(String email, String medicalId);
}
