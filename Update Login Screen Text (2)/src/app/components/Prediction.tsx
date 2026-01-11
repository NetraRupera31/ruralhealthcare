import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, QrCode, X } from 'lucide-react';
import { FormData } from './Forms';
import { useState, useEffect } from 'react';
import QRCodeLib from 'qrcode';

interface PredictionProps {
  formData: FormData;
  onBack: () => void;
}

// Mock prediction logic - this would normally come from backend
function analyzePrediction(data: FormData) {
  // Simple mock logic based on symptoms count and vitals
  const symptomCount = data.symptoms.length;
  const temp = parseFloat(data.temperature) || 98.6;
  const oxygen = parseFloat(data.oxygen) || 98;
  const heartRate = parseFloat(data.heartRate) || 70;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let disease = 'Common Cold';
  let recommendations = [
    'Stay hydrated and get plenty of rest',
    'Monitor symptoms over the next 24-48 hours',
    'Take over-the-counter pain relievers if needed',
  ];

  // High risk conditions
  if (symptomCount >= 8 || temp > 102 || oxygen < 90 || heartRate > 100) {
    riskLevel = 'high';
    disease = 'Acute Respiratory Infection';
    recommendations = [
      'IMMEDIATE MEDICAL ATTENTION REQUIRED',
      'Visit nearest hospital or emergency room',
      'Do not delay seeking professional care',
      'Ensure patient is accompanied at all times',
      'Monitor vital signs continuously',
    ];
  }
  // Medium risk conditions
  else if (symptomCount >= 5 || temp > 100 || oxygen < 95 || heartRate > 90) {
    riskLevel = 'medium';
    disease = 'Viral Fever / Flu';
    recommendations = [
      'Schedule appointment with healthcare provider within 24 hours',
      'Monitor temperature regularly',
      'Maintain hydration - drink 8-10 glasses of water',
      'Take prescribed antipyretics for fever',
      'Avoid contact with others to prevent spread',
    ];
  }

  return { riskLevel, disease, recommendations };
}

export function Prediction({ formData, onBack }: PredictionProps) {
  const { riskLevel, disease, recommendations } = analyzePrediction(formData);
  
  const borderColor = {
    low: 'border-[#4ade80]',
    medium: 'border-yellow-500',
    high: 'border-red-500',
  }[riskLevel];

  const bgColor = {
    low: 'bg-[#4ade80]/10',
    medium: 'bg-yellow-500/10',
    high: 'bg-red-500/10',
  }[riskLevel];

  const textColor = {
    low: 'text-[#4ade80]',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  }[riskLevel];

  const RiskIcon = {
    low: CheckCircle,
    medium: AlertCircle,
    high: AlertTriangle,
  }[riskLevel];

  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        // Create summary text for QR code
        const summary = `PATIENT SUMMARY
Name: ${formData.fullName}
Risk Level: ${riskLevel.toUpperCase()}
Disease: ${disease}
Temperature: ${formData.temperature}°F
Oxygen: ${formData.oxygen}%
Heart Rate: ${formData.heartRate} bpm
Symptoms: ${formData.symptoms.join(', ')}`;
        
        const qr = await QRCodeLib.toDataURL(summary);
        setQrCode(qr);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQrCode();
  }, [formData, riskLevel, disease]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Android Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen - with colored border */}
        <div className={`relative bg-[#0f0f0f] rounded-[2.5rem] overflow-hidden w-[375px] h-[812px] border-4 ${borderColor}`}>
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white rounded-sm">
                <div className="w-2 h-2 bg-white m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Prediction Content */}
          <div className="h-full overflow-y-auto px-6 pt-14 pb-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={onBack} className="text-white">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-white font-semibold">Prediction of</h1>
                <p className="text-gray-400 text-sm">{formData.fullName || 'Patient'}</p>
              </div>
            </div>

            {/* Risk Level Card */}
            <div className={`${bgColor} border ${borderColor} rounded-2xl p-6 mb-6`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <RiskIcon className={`w-12 h-12 ${textColor}`} />
              </div>
              <div className="text-center">
                <h2 className={`${textColor} text-2xl font-bold uppercase mb-2`}>
                  {riskLevel} Risk
                </h2>
                <p className="text-white text-sm">
                  Based on the symptoms and vitals provided
                </p>
              </div>
            </div>

            {/* Disease Prediction */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-gray-400 text-sm mb-2">Disease Predicted</h3>
              <p className="text-white font-semibold mb-4">{disease}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Confidence</p>
                  <p className="text-white font-semibold">
                    {riskLevel === 'high' ? '92%' : riskLevel === 'medium' ? '78%' : '85%'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Severity</p>
                  <p className={`font-semibold ${textColor}`}>
                    {riskLevel.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Vitals Summary */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Vital Signs Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Temperature</p>
                  <p className="text-white">{formData.temperature || '--'}°F</p>
                </div>
                <div>
                  <p className="text-gray-400">Oxygen</p>
                  <p className="text-white">{formData.oxygen || '--'}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Heart Rate</p>
                  <p className="text-white">{formData.heartRate || '--'} bpm</p>
                </div>
                <div>
                  <p className="text-gray-400">BP</p>
                  <p className="text-white">
                    {formData.bloodPressureSys || '--'}/{formData.bloodPressureDia || '--'}
                  </p>
                </div>
              </div>
            </div>

            {/* Symptoms Detected */}
            {formData.symptoms.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">
                  Symptoms Detected ({formData.symptoms.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="bg-[#2a2a2a] text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Recommendations</h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full ${bgColor} ${textColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {index + 1}
                    </div>
                    <p className={`text-sm ${riskLevel === 'high' && index === 0 ? textColor + ' font-bold' : 'text-gray-300'}`}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className={`w-full ${borderColor} border-2 ${textColor} font-semibold py-4 rounded-xl hover:${bgColor} transition-colors`}>
                Download Report
              </button>
              <button 
                onClick={() => setShowQR(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-5 h-5" />
                Share on WhatsApp
              </button>
            </div>
          </div>

          {/* QR Code Modal */}
          {showQR && qrCode && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-[#1a1a1a] rounded-2xl p-6 m-6 max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Scan to Share</h3>
                  <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="bg-white p-4 rounded-xl flex justify-center mb-4">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-gray-400 text-sm text-center">
                  Scan this QR code with WhatsApp to share patient summary
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}