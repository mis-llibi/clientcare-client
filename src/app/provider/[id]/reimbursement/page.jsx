"use client";
import React, { useState } from "react";
import Stepper from "./Stepper";
import SelectionStep from "./SelectionStep";
import VerificationStep from "./VerificationStep";
import ReimbursementForm from "./ReimbursementForm";
import UploadStep from "./UploadStep";

function Reimbursement({ onBack }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null); // 'online' or 'upload'
  const [verifiedData, setVerifiedData] = useState(null);
  const [formData, setFormData] = useState({});

  const steps = [
    { number: 1, title: "Selection" },
    { number: 2, title: "Validation" },
    { number: 3, title: "Details" },
    { number: 4, title: "Upload" },
  ];

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setStep(2);
  };

  const handleVerify = (data) => {
    setVerifiedData(data);
    setStep(3);
  };

  const handleDetailsSubmit = (data) => {
    setFormData(data);
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setMode(null);
    setVerifiedData(null);
    setFormData({});
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-white text-center my-2">
        <h1 className="text-[#1E3161] font-bold roboto text-lg">
          REIMBURSEMENT
        </h1>
      </div>

      {/* Stepper Wrapper */}
      <div className="bg-gray-50 border-b border-gray-100">
        <Stepper currentStep={step} steps={steps} />
      </div>

      {/* Content Area */}
      <div className="bg-white min-h-[500px] p-6">
        {step === 1 && (
          <SelectionStep onSelect={handleSelectMode} onBack={onBack} />
        )}

        {step === 2 && (
          <VerificationStep
            onVerify={handleVerify}
            onBack={() => setStep(1)}
            initialData={verifiedData} // Optional: preserve if they go back
          />
        )}

        {step === 3 && (
          <ReimbursementForm
            verifiedData={verifiedData}
            mode={mode}
            onBack={() => setStep(2)}
            onNext={handleDetailsSubmit}
            initialData={formData}
          />
        )}

        {step === 4 && (
          <UploadStep
            verifiedData={verifiedData}
            mode={mode}
            formData={formData}
            onBack={() => setStep(3)}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default Reimbursement;
