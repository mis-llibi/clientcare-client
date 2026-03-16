import React from "react";

const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-[20px] h-0.5 bg-gray-200 -z-0 mx-10" />

        {/* Active Line Progress */}
        <div
          className="absolute left-10 top-[20px] h-0.5 bg-[#0073aa] -z-0 transition-all duration-500 ease-in-out"
          style={{
            width: `calc(${(currentStep - 1) / (steps.length - 1)} * (100% - 5rem))`,
            maxWidth: "calc(100% - 5rem)",
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative z-10 w-20"
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm
                ${
                  isActive
                    ? "border-[#0073aa] bg-[#0073aa] text-white shadow-lg scale-110"
                    : isCompleted
                      ? "border-[#0073aa] bg-[#0073aa] text-white"
                      : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {step.number}
              </div>

              {/* Step Title */}
              <span
                className={`mt-2 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-center transition-colors duration-300 roboto
                ${isActive || isCompleted ? "text-[#0073aa]" : "text-gray-400"}`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
