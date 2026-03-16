import React from "react";
import {
  HiOutlineDocumentText,
  HiOutlineCloudArrowUp,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";

const SelectionStep = ({ onSelect }) => {
  const modes = [
    {
      id: "online",
      title: "Fill Up Online",
      description:
        "Complete the reimbursement form digitally and submit requirements.",
      icon: <HiOutlineDocumentText size={48} />,
    },
    {
      id: "upload",
      title: "Upload Manual Form",
      description:
        "Upload a pre-filled PDF reimbursement form and requirements.",
      icon: <HiOutlineCloudArrowUp size={48} />,
    },
  ];

  return (
    <div className="flex flex-col items-center animate-fade-in py-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1E3161] roboto mb-2">
          How would you like to proceed?
        </h2>
        <p className="text-gray-500 font-medium roboto">
          Select your preferred method to submit your claim
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 rounded-2xl transition-all duration-300 hover:border-[#1E3161] hover:shadow-xl hover:-translate-y-1 group text-center cursor-pointer"
          >
            <div className="text-[#1E3161]/40 group-hover:text-[#1E3161] mb-6 transition-colors duration-300">
              {mode.icon}
            </div>
            <h3 className="text-xl font-bold text-[#1E3161] roboto mb-3">
              {mode.title}
            </h3>
            <p className="text-sm text-gray-500 roboto leading-relaxed">
              {mode.description}
            </p>
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg text-center">
        <a
          href="https://llibi.site/wp-content/uploads/2025/06/LLIBI_CLAIM_REIMBURSEMENT_FORM_v2023.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#0073aa] font-bold hover:underline group px-4 py-2"
        >
          <HiOutlineArrowDownTray className="group-hover:animate-bounce" />
          Download Reimbursement Form (PDF)
        </a>
      </div>
    </div>
  );
};

export default SelectionStep;
