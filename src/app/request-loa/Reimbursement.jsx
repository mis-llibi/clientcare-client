import React, { useState } from "react";
import Stepper from "./Stepper";
import SelectionStep from "./SelectionStep";
import VerificationStep from "./VerificationStep";
import ReimbursementForm from "./ReimbursementForm";
import UploadStep from "./UploadStep";

function Reimbursement() {
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

  return (
    <div className="w-full max-w-5xl mx-auto pb-10">
      <div className="text-white text-center my-2">
        <h1 className="text-[#1E3161] font-bold roboto text-lg">
          REIMBURSEMENT
        </h1>
      </div>

      {/* Stepper Wrapper */}
      <div className="bg-gray-50 border-b border-gray-100">
        <Stepper currentStep={step} steps={steps} />
      </div>

      {/* Dynamic Step Content */}
      <div className="flex-1 p-6 md:p-10 transition-all duration-300">
        {step === 1 && <SelectionStep onSelect={handleSelectMode} />}

        {step === 2 && (
          <VerificationStep
            onVerify={handleVerify}
            onBack={handleBack}
            initialData={verifiedData}
          />
        )}

        {step === 3 && (
          <ReimbursementForm
            verifiedData={verifiedData}
            initialData={formData}
            mode={mode}
            onBack={handleBack}
            onNext={handleDetailsSubmit}
          />
        )}

        {step === 4 && (
          <UploadStep
            verifiedData={verifiedData}
            formData={formData}
            mode={mode}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default Reimbursement;
