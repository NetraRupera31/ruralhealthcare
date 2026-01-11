import { patientAPI } from './api';

// Simple Web Database Service - For Web Browser
// Note: For offline-first mobile app with SQLite, use Expo Go with react_native_sqlite.js

class SimpleDatabaseService {
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.setupNetworkListener();
  }

  setupNetworkListener() {
    window.addEventListener('online', () => {
      console.log('Network: Online');
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      console.log('Network: Offline');
      this.isOnline = false;
    });
  }

  getNetworkStatus() {
    return this.isOnline;
  }

  async createPatient(patientData: any) {
    try {
      const response = await patientAPI.create(patientData);
      return { success: true, id: response.id };
    } catch (error: any) {
      console.error('Create patient error:', error);
      throw error;
    }
  }

  async getPatients() {
    try {
      const patients = await patientAPI.getAll();
      return patients;
    } catch (error) {
      console.error('Get patients error:', error);
      return [];
    }
  }

  async getPatient(patientId: number) {
    try {
      return await patientAPI.getById(patientId);
    } catch (error) {
      console.error('Get patient error:', error);
      return null;
    }
  }

  async updatePatient(patientId: number, updates: any) {
    try {
      await patientAPI.update(patientId, updates);
      return { success: true };
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  }

  async deletePatient(patientId: number) {
    try {
      await patientAPI.delete(patientId);
      return { success: true };
    } catch (error) {
      console.error('Delete patient error:', error);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const patients = await patientAPI.getAll();
      return {
        totalPatients: patients.length,
        highRisk: patients.filter((p: any) => p.riskLevel === 'high').length,
        mediumRisk: patients.filter((p: any) => p.riskLevel === 'medium').length,
        lowRisk: patients.filter((p: any) => p.riskLevel === 'low').length,
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {};
    }
  }

  async getPendingSyncCount() {
    return 0;
  }

  async clearDatabase() {
    console.log('Web version: No local database to clear');
  }
}

export default new SimpleDatabaseService();
