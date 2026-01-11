// API Service for Healthcare Application

const API_BASE_URL = 'http://localhost:8080/api';

// Store auth token
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    medicalId: string;
    hospital: string;
    hospitalPhone: string;
    specialization?: string;
  }) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(response.token);
    return response;
  },

  login: async (identifier: string, password: string) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  getCurrentDoctor: async () => {
    return apiCall('/auth/me');
  },

  logout: () => {
    setAuthToken(null);
  },
};

// Patient API
export interface PatientData {
  name: string;
  age: number;
  gender: string;
  phone: string;
  familyPhone?: string;
  state: string;
  city: string;
  weight?: number;
  height?: number;
  temperature?: number;
  bloodPressure?: string;
  oxygen?: number;
  pulse?: number;
  symptoms?: string[];
  voiceSymptoms?: string;
  riskLevel?: string;
  disease?: string;
  triggers?: string[];
  recommendations?: string[];
}

export const patientAPI = {
  create: async (patientData: PatientData) => {
    return apiCall('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  getAll: async () => {
    return apiCall('/patients');
  },

  getById: async (id: number) => {
    return apiCall(`/patients/${id}`);
  },

  update: async (id: number, patientData: PatientData) => {
    return apiCall(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  delete: async (id: number) => {
    return apiCall(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    return apiCall('/analytics/dashboard');
  },
};
