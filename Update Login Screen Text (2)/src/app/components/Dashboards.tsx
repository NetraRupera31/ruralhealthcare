import { Menu, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { SubmittedFormData } from '../App';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { patientAPI } from '../../services/api';

interface DashboardsProps {
  onNavigate: (screen: string) => void;
  submittedForms: SubmittedFormData[];
}

export function Dashboards({ onNavigate, submittedForms }: DashboardsProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [backendPatients, setBackendPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load patients from backend
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patients = await patientAPI.getAll();
        setBackendPatients(patients);
      } catch (error) {
        console.error('Failed to load patients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPatients();
  }, []);

  // Combine frontend and backend data
  const allPatients = [...submittedForms, ...backendPatients];

  // Calculate gender distribution
  const genderData = [
    { name: 'Male', value: allPatients.filter(f => f.gender === 'Male').length },
    { name: 'Female', value: allPatients.filter(f => f.gender === 'Female').length },
  ].filter(d => d.value > 0);

  // Calculate age categories
  const ageCategories = allPatients.reduce((acc, form) => {
    const age = parseInt(form.age);
    if (age < 18) {
      acc.child++;
    } else if (age <= 60) {
      acc.adult++;
    } else {
      acc.senior++;
    }
    return acc;
  }, { child: 0, adult: 0, senior: 0 });

  const ageData = [
    { name: 'Child (<18)', value: ageCategories.child },
    { name: 'Adult (18-60)', value: ageCategories.adult },
    { name: 'Senior (>60)', value: ageCategories.senior },
  ].filter(d => d.value > 0);

  // Calculate disease distribution
  const diseaseMap = allPatients.reduce((acc, form) => {
    const disease = form.disease || 'Unknown';
    acc[disease] = (acc[disease] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const diseaseData = Object.entries(diseaseMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate risk distribution
  const riskData = [
    { name: 'Low Risk', value: submittedForms.filter(f => f.riskLevel === 'low').length, color: '#4ade80' },
    { name: 'Medium Risk', value: submittedForms.filter(f => f.riskLevel === 'medium').length, color: '#eab308' },
    { name: 'High Risk', value: submittedForms.filter(f => f.riskLevel === 'high').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Calculate city distribution
  const cityMap = submittedForms.reduce((acc, form) => {
    if (form.location) {
      acc[form.location] = (acc[form.location] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const cityData = Object.entries(cityMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#4ade80', '#60a5fa', '#f59e0b', '#8b5cf6', '#ec4899'];

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

          {/* Dashboard Content */}
          <div className="h-full overflow-y-auto px-6 pt-14 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button className="text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-white font-semibold">Analytics Dashboard</h1>
              <TrendingUp className="w-6 h-6 text-[#4ade80]" />
            </div>

            {submittedForms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <p className="text-gray-400 text-center">
                  No data available yet.<br />Submit forms to see analytics.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Risk Distribution */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-4">Risk Distribution</h3>
                  {riskData.length > 0 && (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Gender Distribution */}
                {genderData.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-4">Gender Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={genderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                        <Bar dataKey="value" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Age Categories */}
                {ageData.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-4">Age Categories</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={ageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Disease Distribution */}
                {diseaseData.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-4">Diseases Detected</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={diseaseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                        <Bar dataKey="value" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* City Distribution */}
                {cityData.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-4">Patients by City</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={cityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                        <Bar dataKey="value" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-4">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Patients</span>
                      <span className="text-white font-bold">{submittedForms.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">High Risk Cases</span>
                      <span className="text-red-400 font-bold">{riskData.find(r => r.name === 'High Risk')?.value || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Medium Risk Cases</span>
                      <span className="text-yellow-400 font-bold">{riskData.find(r => r.name === 'Medium Risk')?.value || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Low Risk Cases</span>
                      <span className="text-green-400 font-bold">{riskData.find(r => r.name === 'Low Risk')?.value || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentScreen="dashboards"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
