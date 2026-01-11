import { Menu, ArrowLeft, MapPin, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { patientAPI } from '../../services/api';
import DatabaseService from '../../services/database';

interface FormsProps {
  onNavigate: (screen: string) => void;
  onSubmitForm?: (formData: FormData) => void;
}

export interface FormData {
  fullName: string;
  age: string;
  gender: string;
  location: string;
  weight: string;
  height: string;
  bloodPressureSys: string;
  bloodPressureDia: string;
  temperature: string;
  oxygen: string;
  heartRate: string;
  symptoms: string[];
}

export function Forms({ onNavigate, onSubmitForm }: FormsProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    age: '',
    gender: 'Male',
    location: '',
    weight: '',
    height: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    temperature: '',
    oxygen: '',
    heartRate: '',
    symptoms: [],
  });

  const allSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Dizziness',
    'Chills', 'Sore Throat', 'Joint Pain', 'Vomiting', 'Chest Pain', 'Shortness of Breath',
    'Abdominal Pain', 'Diarrhea', 'Loss of Appetite', 'Muscle Pain', 'Weakness', 'Sweating',
    'Rash', 'Runny Nose', 'Sneezing', 'Back Pain', 'Constipation', 'Confusion',
    'Swelling', 'Numbness', 'Blurred Vision', 'Ear Pain', 'Anxiety', 'Insomnia'
  ];

  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const displayedSymptoms = showAllSymptoms ? allSymptoms : allSymptoms.slice(0, 10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.age || !formData.location) {
      setSubmitError('Please fill in all required fields (Name, Age, Location)');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Calculate risk level based on symptoms and vitals
      const symptomCount = formData.symptoms.length;
      const temp = parseFloat(formData.temperature) || 98.6;
      const oxygen = parseFloat(formData.oxygen) || 98;
      const heartRate = parseFloat(formData.heartRate) || 70;
      
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let disease = 'Common Cold';
      
      if (symptomCount >= 8 || temp > 102 || oxygen < 90 || heartRate > 100) {
        riskLevel = 'high';
        disease = 'Acute Respiratory Infection';
      } else if (symptomCount >= 5 || temp > 100 || oxygen < 95 || heartRate > 90) {
        riskLevel = 'medium';
        disease = 'Viral Fever / Flu';
      }

      // Parse location to get state and city
      const [city, state] = formData.location.split(',').map(s => s.trim());

      // Prepare patient data for backend
      const patientData = {
        name: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: '0000000000', // You may want to add phone field to form
        state: state || formData.location,
        city: city || formData.location,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        temperature: temp,
        bloodPressure: `${formData.bloodPressureSys}/${formData.bloodPressureDia}`,
        oxygen: oxygen,
        pulse: parseInt(formData.heartRate) || undefined,
        symptoms: formData.symptoms,
        riskLevel,
        disease,
      };

      // Save to backend
      try {
        await DatabaseService.createPatient(patientData);
        
        // Call the original onSubmitForm to update UI
        if (onSubmitForm) {
          onSubmitForm(formData);
        }
      } catch (dbError) {
        // Fallback to direct API call if IndexedDB fails
        console.log('IndexedDB unavailable, using direct API');
        await patientAPI.create(patientData);
        
        if (onSubmitForm) {
          onSubmitForm(formData);
        }
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save patient data. Please try again.';
      setSubmitError(errorMsg);
      console.error('Submit error:', error);
      console.error('Patient data:', patientData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = formData.symptoms.length;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Android Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen */}
        <div className="relative bg-[#0f0f0f] rounded-[2.5rem] overflow-hidden w-[375px] h-[812px]">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white rounded-sm">
                <div className="w-2 h-2 bg-white m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Header - Fixed */}
          <div className="absolute top-0 left-0 right-0 bg-[#0f0f0f] pt-12 pb-4 px-6 z-10 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <button className="text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1 ml-4">
                <h1 className="text-white font-semibold">New Assessment</h1>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-[#4ade80] rounded-full"></div>
                  <span className="text-[#4ade80]">Offline Mode Active</span>
                </div>
              </div>
              <button className="text-white">
                <span className="text-2xl">⋮</span>
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#4ade80] w-1/3"></div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto pt-32 pb-24 px-6">
            {/* Section 1: Patient Details */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#4ade80] rounded-full flex items-center justify-center text-black text-sm font-bold">1</div>
                <h2 className="text-white font-semibold">Patient Details</h2>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Age</label>
                    <input
                      type="text"
                      placeholder="--"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-center focus:outline-none focus:border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFormData({ ...formData, gender: 'Male' })}
                        className={`py-3 rounded-xl border ${
                          formData.gender === 'Male'
                            ? 'bg-[#2a2a2a] border-gray-600 text-white'
                            : 'bg-transparent border-gray-700 text-gray-500'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, gender: 'Female' })}
                        className={`py-3 rounded-xl border ${
                          formData.gender === 'Female'
                            ? 'bg-[#2a2a2a] border-gray-600 text-white'
                            : 'bg-transparent border-gray-700 text-gray-500'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>

                {/* Region/Location */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Region (Gujarat)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Select City"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Basic Vitals */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h2 className="text-white font-semibold">Basic Vitals</h2>
              </div>

              <div className="space-y-4">
                {/* Weight and Height */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">WEIGHT (KG)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="00.0"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">HEIGHT (CM)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="000"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
                    </div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">BLOOD PRESSURE</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="SYS"
                      value={formData.bloodPressureSys}
                      onChange={(e) => setFormData({ ...formData, bloodPressureSys: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-center focus:outline-none focus:border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="DIA"
                      value={formData.bloodPressureDia}
                      onChange={(e) => setFormData({ ...formData, bloodPressureDia: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-center focus:outline-none focus:border-gray-600"
                    />
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">TEMPERATURE (°F)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00.0"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">°F</span>
                  </div>
                </div>

                {/* Oxygen SPO2 */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">OXYGEN (SPO2)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00"
                      value={formData.oxygen}
                      onChange={(e) => setFormData({ ...formData, oxygen: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>

                {/* Heart Rate */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">HEART RATE (BPM)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">bpm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Symptoms */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <h2 className="text-white font-semibold">Symptoms</h2>
                </div>
                <span className="text-red-500 text-sm">
                  {selectedCount > 0 ? `Select at least ${3 - selectedCount < 0 ? 0 : 3 - selectedCount}` : 'Select at least 3'}
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Quick search symptoms..."
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>

              {/* Symptom Checkboxes */}
              <div className="grid grid-cols-2 gap-3">
                {displayedSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`py-3 px-4 rounded-xl border text-left transition-colors ${
                      formData.symptoms.includes(symptom)
                        ? 'bg-[#2a2a2a] border-gray-600 text-white'
                        : 'bg-transparent border-gray-700 text-gray-400'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>

              {/* Show More Button */}
              {!showAllSymptoms && (
                <button
                  onClick={() => setShowAllSymptoms(true)}
                  className="w-full mt-4 text-[#4ade80] py-2 flex items-center justify-center gap-1"
                >
                  Show {allSymptoms.length - 10} more symptoms
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Fixed Submit Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent">
            {submitError && (
              <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {submitError}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#4ade80] hover:bg-[#3bc56a] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">🤖</span>
              {isSubmitting ? 'Saving...' : 'Submit and Predict'}
            </button>
          </div>

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentScreen="forms"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
