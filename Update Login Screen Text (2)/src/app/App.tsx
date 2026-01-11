import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, BriefcaseMedical } from 'lucide-react';
import { Home } from './components/Home';
import { Forms, FormData } from './components/Forms';
import { Dashboards } from './components/Dashboards';
import { Settings } from './components/Settings';
import { Prediction } from './components/Prediction';
import { authAPI, getAuthToken } from '../services/api';

export interface SubmittedFormData extends FormData {
  id: string;
  submittedAt: Date;
  riskLevel: 'low' | 'medium' | 'high';
  disease: string;
}

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [medicalId, setMedicalId] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submittedForms, setSubmittedForms] = useState<SubmittedFormData[]>([]);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authAPI.getCurrentDoctor()
        .then(doctor => {
          setUserName(doctor.name);
          setIsLoggedIn(true);
        })
        .catch(() => {
          authAPI.logout();
        });
    }
  }, []);

  const handleLogin = async () => {
    // Security disabled - allow login with any credentials
    if (!medicalId) {
      setLoginError('Please enter an email or ID');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await authAPI.login(medicalId, password || 'any');
      setUserName(response.doctor.name);
      setIsLoggedIn(true);
    } catch (error: any) {
      // Even if backend fails, allow login
      setUserName('Dr. ' + medicalId);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    if (screen !== 'prediction') {
      setFormData(null);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    
    // Calculate risk level (same logic as in Prediction component)
    const symptomCount = data.symptoms.length;
    const temp = parseFloat(data.temperature) || 98.6;
    const oxygen = parseFloat(data.oxygen) || 98;
    const heartRate = parseFloat(data.heartRate) || 70;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let disease = 'Common Cold';
    
    if (symptomCount >= 8 || temp > 102 || oxygen < 90 || heartRate > 100) {
      riskLevel = 'high';
      disease = 'Acute Respiratory Infection';
    } else if (symptomCount >= 5 || temp > 100 || oxygen < 95 || heartRate > 90) {
      riskLevel = 'medium';
      disease = 'Viral Fever / Flu';
    }
    
    // Add to submitted forms
    const submittedForm: SubmittedFormData = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date(),
      riskLevel,
      disease,
    };
    
    setSubmittedForms(prev => [...prev, submittedForm]);
    setCurrentScreen('prediction');
  };

  if (isLoggedIn) {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={handleNavigate} userName={userName} submittedForms={submittedForms} />;
      case 'forms':
        return <Forms onNavigate={handleNavigate} onSubmitForm={handleFormSubmit} />;
      case 'dashboards':
        return <Dashboards onNavigate={handleNavigate} submittedForms={submittedForms} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      case 'prediction':
        return formData ? (
          <Prediction formData={formData} onBack={() => handleNavigate('forms')} />
        ) : (
          <Forms onNavigate={handleNavigate} onSubmitForm={handleFormSubmit} />
        );
      default:
        return <Home onNavigate={handleNavigate} userName={userName} submittedForms={submittedForms} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Android Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen */}
        <div className="relative bg-[#0d3b2f] rounded-[2.5rem] overflow-hidden w-[375px] h-[812px]">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white rounded-sm">
                <div className="w-2 h-2 bg-white m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Login Screen Content */}
          <div className="h-full flex items-center justify-center px-6 pt-12">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="bg-[#1a5742] rounded-3xl p-6">
                  <BriefcaseMedical className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-12">
                <h1 className="text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400">RuHe Assistant</p>
              </div>

              {/* Login Form */}
              <div className="space-y-4 mb-6">
                {/* User Name Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-transparent border border-gray-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  />
                </div>

                {/* Medical ID Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Medical ID / Email"
                    value={medicalId}
                    onChange={(e) => setMedicalId(e.target.value)}
                    className="w-full bg-transparent border border-gray-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border border-gray-600 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right mb-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  Forgot Password?
                </a>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {loginError}
                </div>
              )}

              {/* Login Button */}
              <button
                className="w-full bg-[#4ade80] hover:bg-[#3bc56a] text-[#0d3b2f] font-semibold py-4 rounded-2xl mb-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>

              {/* System Status */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${isLoading ? 'bg-yellow-500' : 'bg-[#4ade80]'} rounded-full`}></div>
                  <span className="text-white">
                    {isLoading ? 'Connecting...' : 'System Ready: Online Mode'}
                  </span>
                </div>
                <span className="text-gray-500">v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}