import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInputMask from "@/components/InputMask";
import { FaCheckCircle } from "react-icons/fa";
import { ClientRequestDesktop } from "@/hooks/ClientRequestDesktop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilesCheckSummaryModal from "./FilesCheckSummaryModal";

const REQ_DATA = {
  in_patient: [
    "Accomplished Reimbursement Form",
    "Valid Government ID",
    "Statement of Account",
    "Itemized Statement of Account",
    "Medical Certificate with Diagnosis",
    "Official Receipts of Hospital Charges and/or Professional Fees",
  ],
  out_patient: [
    "Accomplished Reimbursement Form",
    "Valid Government ID",
    "Doctor's Laboratory Request",
    "Medical Certificate with Diagnosis",
    "Official Receipts of Hospital Charges and/or Professional Fees",
  ],
  opd_medicines: [
    "Accomplished Reimbursement Form",
    "Valid Government ID",
    "Medical Certificate with Diagnosis",
    "Medicine Prescription",
    "Official Receipts of Medicines",
  ],
};

const ReimbursementForm = ({
  verifiedData,
  mode,
  onBack,
  onNext,
  initialData,
}) => {
  const isUploadOnly = mode === "upload";
  const [claimType, setClaimType] = useState(initialData?.claimType || "");
  const [claimTypeError, setClaimTypeError] = useState(false);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { submitReimbursement, submitReimbursementByFiles } =
    ClientRequestDesktop();
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const requiredDocs = claimType ? REQ_DATA[claimType] : [];
  const uploadedReqs = requiredDocs.filter(
    (req) => files[req] && files[req].length > 0,
  );
  const missingReqs = requiredDocs.filter(
    (req) => !files[req] || files[req].length === 0,
  );
  const hasMissing = missingReqs.length > 0;

  const handleTermsAgree = () => {
    setPrivacyConsent(true);
    setIsTermsOpen(false);
  };

  const handleTermsDisagree = () => {
    setPrivacyConsent(false);
    setIsTermsOpen(false);
  };

  const handleFileUpload = (req, uploadedFiles) => {
    setFiles((prev) => ({
      ...prev,
      [req]: [...(prev[req] || []), ...Array.from(uploadedFiles)],
    }));
  };

  const handleRemoveFileRequirement = (req, fileIndex) => {
    setFiles((prev) => {
      const updatedReqFiles = [...(prev[req] || [])];
      updatedReqFiles.splice(fileIndex, 1);
      return {
        ...prev,
        [req]: updatedReqFiles,
      };
    });
  };

  const getAccountName = () => {
    if (initialData?.account_name) return initialData.account_name;

    if (verifiedData?.dob) {
      const birthDate = new Date(verifiedData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (verifiedData?.patientType === "dependent" && age < 18) {
        return verifiedData.employee_full_name || "";
      }
    }

    return verifiedData?.patient_full_name || "";
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patient_full_name:
        initialData?.patient_full_name || verifiedData?.patient_full_name || "",
      employee_full_name:
        initialData?.employee_full_name ||
        verifiedData?.employee_full_name ||
        "",
      company_name:
        initialData?.company_name || verifiedData?.company_name || "",
      employee_email: initialData?.employee_email || verifiedData?.email || "",
      mobile_number: initialData?.mobile_number || verifiedData?.contact || "",
      mode_of_payment: initialData?.mode_of_payment || "",
      account_name: getAccountName(),
      account_holder_address: initialData?.account_holder_address || "",
      bank_name: initialData?.bank_name || "",
      account_number: initialData?.account_number || "",
      date_availment: initialData?.date_availment || "",
      date_submission:
        initialData?.date_submission || new Date().toISOString().split("T")[0],
    },
  });

  const selectedModeOfPayment = watch("mode_of_payment");

  const onSubmit = (data) => {
    // Validate claimType
    if (!claimType) {
      setClaimTypeError(true);
      return;
    }
    setClaimTypeError(false);

    // Transform claimType into booleans
    const claimTypes = {
      in_patient: claimType === "in_patient",
      out_patient: claimType === "out_patient",
      opd_medicines: claimType === "opd_medicines",
      claimType: claimType, // Save the selected claim type string for restoration
    };

    setFormDataToSubmit({ ...data, ...claimTypes, files });
    setIsSummaryModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!claimType) {
      setClaimTypeError(true);
    }
    handleSubmit(onSubmit)(e);
  };

  const handleFinalSubmit = async (data) => {
    setLoading(true);
    const finalFormData = new FormData();

    // Hardcode request-origin for both modes
    finalFormData.append("request-origin", "client-care");

    // === Upload Manual Form Mode ===
    if (mode === "upload") {
      if (verifiedData?.member_id) {
        finalFormData.append("member_id", verifiedData.member_id);
      }
      finalFormData.append(
        "email",
        data.employee_email || verifiedData?.email || "",
      );

      finalFormData.append("requirement_type", claimType);

      if (data.files && Object.keys(data.files).length > 0) {
        Object.entries(data.files).forEach(([req, fileArr]) => {
          if (fileArr && fileArr.length > 0) {
            fileArr.forEach((file) => {
              finalFormData.append("files[]", file, file.name);
              finalFormData.append("file_requirement_types[]", req);
            });
          }
        });
      }

      await submitReimbursementByFiles({
        formData: finalFormData,
        setLoading,
        showAlert: false,
        reset: (resData) => {
          const isNextBusinessDay =
            resData?.data?.nextBusinessDayProcessing === true;

          if (isNextBusinessDay) {
            setSuccessMessage(
              "Thank you for your submission. Our team will review your request on the next business day and we will respond with the next steps soon.",
            );
          } else {
            setSuccessMessage(
              "Thank you for your submission. Our team is currently reviewing your request and we will respond with the next steps soon.",
            );
          }

          setShowSuccess(true);
        },
      });
      return;
    }

    // === Regular Online Reimbursement Mode ===

    if (verifiedData?.member_id) {
      finalFormData.append("member_id", verifiedData.member_id);
    }

    Object.keys(data).forEach((key) => {
      if (
        ![
          "in_patient",
          "out_patient",
          "opd_medicines",
          "claimType",
          "files",
        ].includes(key)
      ) {
        finalFormData.append(key, data[key]);
      }
    });

    const claimTypesArr = ["in_patient", "out_patient", "opd_medicines"];
    claimTypesArr.forEach((key) => {
      const val = data[key] ? "1" : "0";
      finalFormData.append(key, val);
    });

    if (data.files && Object.keys(data.files).length > 0) {
      Object.entries(data.files).forEach(([req, fileArr]) => {
        if (fileArr && fileArr.length > 0) {
          fileArr.forEach((file) => {
            finalFormData.append("files[]", file, file.name);
            finalFormData.append("file_requirement_types[]", req);
          });
        }
      });
    }

    await submitReimbursement({
      formData: finalFormData,
      setLoading,
      showAlert: false,
      reset: (resData) => {
        const isNextBusinessDay =
          resData?.data?.nextBusinessDayProcessing === true;

        if (isNextBusinessDay) {
          setSuccessMessage(
            "We have received your reimbursement claim request. Your request will be processed on the next business day. We will get back to you.",
          );
        } else {
          setSuccessMessage(
            "We have received your reimbursement claim request. We will review your documents and get back to you.",
          );
        }

        setShowSuccess(true);
      },
    });
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="text-green-600 text-6xl" />
          </div>
          <h3 className="text-3xl font-bold text-[#1E3161] mb-4 roboto">
            Submission Received!
          </h3>
          <p className="text-gray-600 roboto max-w-md mx-auto">
            {successMessage ||
              "We have received your reimbursement claim request. We will review your documents and get back to you."}
          </p>

          <div className="mt-8 flex justify-center w-full">
            <button
              onClick={onNext}
              className="w-full sm:w-auto px-8 py-3 bg-[#1E3161] text-white rounded-lg font-bold hover:bg-[#005f8d] transition-colors roboto shadow-lg cursor-pointer"
            >
              Back to Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Section: Requirement Type */}
        {!isUploadOnly && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#1E3161] uppercase roboto">
                REIMBURSMENT CLAIM TYPE
              </h3>
              <p className="text-sm text-gray-500 roboto mt-1">
                Select the type of claim and prepare required documents for
                submission.
              </p>
            </div>

            {/* Tabs */}
            <div
              className={`flex bg-gray-100 p-1 rounded-lg ${claimTypeError ? "border border-red-500" : ""}`}
            >
              {Object.keys(REQ_DATA).map((key) => {
                const labels = {
                  in_patient: "In-Patient",
                  out_patient: "Out-Patient",
                  opd_medicines: "OPD Medicines",
                };
                const isActive = claimType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setClaimType(key);
                      setClaimTypeError(false);
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all roboto ${
                      isActive
                        ? "bg-white text-[#0073aa] shadow-sm"
                        : "text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    {labels[key]}
                  </button>
                );
              })}
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-4 pt-4">
              {claimType && REQ_DATA[claimType] ? (
                REQ_DATA[claimType].map((req, index) => (
                  <div
                    key={index}
                    className={`border rounded-xl p-4 shadow-sm flex flex-col gap-2 ${
                      files[req] && files[req].length > 0
                        ? "bg-[#eef4f9] border-[#d2e3f0]"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#1E3161] text-sm">
                          {req}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported: PDF, JPG, PNG (Max 10MB per file)
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-blue-50 text-[#0073aa] text-[11px] font-bold px-3 py-1 rounded-full">
                          {files[req] ? files[req].length : 0} files uploaded
                        </span>
                        <label className="text-[#1E3161] font-bold text-sm cursor-pointer hover:underline">
                          Upload
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileUpload(req, e.target.files)
                            }
                          />
                        </label>
                      </div>
                    </div>
                    {files[req] && files[req].length > 0 && (
                      <div className="mt-2 space-y-2">
                        {Array.from(files[req]).map((f, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center bg-white rounded-lg p-3 text-sm border border-gray-100"
                          >
                            <span className="truncate pr-4 text-gray-700">
                              {f.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFileRequirement(req, i)
                              }
                              className="text-red-500 hover:text-red-700 font-bold shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic p-4 text-center roboto">
                  Select a claim type above to see requirements
                </div>
              )}
            </div>
            {claimType && (
              <div className="border border-red-500 pt-2 mx-5 p-4 rounded-lg">
                <span className="text-sm space-y-3 pt-2 text-red-500 roboto">
                  Note: To avoid delays, kindly provide all required documents
                  when submitting your reimbursement request.
                </span>
              </div>
            )}
          </div>
        )}
        {!isUploadOnly && claimTypeError && (
          <div className="-mt-6">
            <span className="text-red-500 text-xs roboto ml-3">
              Requirement Type is required
            </span>
          </div>
        )}

        {!isUploadOnly && (
          <>
            {/* Section: Patient & Employee Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-[#1E3161] uppercase tracking-wider border-b pb-2 roboto">
                Patient & Employee Information
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Patient Name
                  </label>
                  <input
                    {...register("patient_full_name", { required: true })}
                    readOnly
                    className="w-full border p-2 rounded-lg text-sm bg-gray-100 cursor-not-allowed focus:outline-none"
                  />
                  {errors.patient_full_name && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Patient Name is required
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Employee Name
                  </label>
                  <input
                    {...register("employee_full_name", { required: true })}
                    readOnly
                    className="w-full border p-2 rounded-lg text-sm bg-gray-100 cursor-not-allowed focus:outline-none"
                  />
                  {errors.employee_full_name && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Employee Name is required
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Company Name
                  </label>
                  <input
                    {...register("company_name", { required: true })}
                    readOnly
                    className="w-full border p-2 rounded-lg text-sm bg-gray-100 cursor-not-allowed focus:outline-none"
                  />
                  {errors.company_name && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Company Name is required
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Contact Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-[#1E3161] uppercase tracking-wider border-b pb-2 roboto">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("employee_email", { required: true })}
                    className="w-full border p-2 rounded-lg text-sm bg-white"
                  />
                  {errors.employee_email && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Email Address is required
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Mobile Number
                  </label>
                  <Controller
                    name="mobile_number"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <PhoneInputMask
                        {...field}
                        className="w-full border p-2 rounded-lg text-sm bg-white active:outline-[#1E3161]"
                      />
                    )}
                  />
                  {errors.mobile_number && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Mobile Number is required
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Payment Details */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-[#1E3161] uppercase tracking-wider border-b pb-2 roboto">
                Payment Details
              </h4>

              {/* Mode of Payment */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Preferred Mode of Payment{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:border-[#1E3161] transition-all group">
                    <input
                      type="radio"
                      {...register("mode_of_payment", { required: true })}
                      value="1"
                      className="w-4 h-4 accent-[#1E3161]"
                    />
                    <span className="text-sm font-medium roboto group-hover:text-[#1E3161]">
                      Check Payment
                    </span>
                  </label>
                  <label className="flex-1 flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:border-[#1E3161] transition-all group">
                    <input
                      type="radio"
                      {...register("mode_of_payment", { required: true })}
                      value="0"
                      className="w-4 h-4 accent-[#1E3161]"
                    />
                    <span className="text-sm font-medium roboto group-hover:text-[#1E3161]">
                      Bank Transfer
                    </span>
                  </label>
                </div>
                {errors.mode_of_payment && (
                  <span className="text-red-500 text-xs roboto">
                    Please select a mode of payment
                  </span>
                )}
              </div>

              {/* Bank Fields */}
              {selectedModeOfPayment === "0" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("bank_name", {
                        required: selectedModeOfPayment === "0",
                      })}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                    {errors.bank_name && (
                      <span className="text-red-500 text-xs roboto ml-2">
                        Bank Name is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("account_number", {
                        required: selectedModeOfPayment === "0",
                      })}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                    {errors.account_number && (
                      <span className="text-red-500 text-xs roboto ml-2">
                        Account Number is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("account_name", {
                        required: selectedModeOfPayment === "0",
                      })}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                    {errors.account_name && (
                      <span className="text-red-500 text-xs roboto ml-2">
                        Account Name is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Account Holder Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("account_holder_address", {
                        required: selectedModeOfPayment === "0",
                      })}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                    {errors.account_holder_address && (
                      <span className="text-red-500 text-xs roboto ml-2">
                        Account Holder Address is required
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section: Claim Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-[#1E3161] uppercase tracking-wider border-b pb-2 roboto">
                Claim Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Date of Availment/Discharge{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    {...register("date_availment", { required: true })}
                    className="w-full border p-2 rounded-lg text-sm bg-white"
                  />
                  {errors.date_availment && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Date of Availment/Discharge is required
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Date of Submission
                  </label>
                  <input
                    type="date"
                    {...register("date_submission")}
                    disabled
                    className="w-full border p-2 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section: Terms and Agreement */}
            <div className="flex flex-col gap-2">
              <div
                className="flex gap-4 items-start p-6 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setIsTermsOpen(true)}
              >
                <input
                  type="checkbox"
                  id="privacy-consent-online"
                  checked={privacyConsent}
                  readOnly
                  className="w-5 h-5 mt-0.5 accent-[#0073aa] cursor-pointer"
                />
                <label
                  htmlFor="privacy-consent-online"
                  className="text-xs text-gray-600 leading-relaxed roboto cursor-pointer pointer-events-none"
                >
                  I have read, understood, and accepted the terms and agreement.
                </label>
              </div>
            </div>
          </>
        )}

        {isUploadOnly && (
          <>
            {/* Section: Requirement Type (Upload Mode) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#1E3161] uppercase roboto">
                  REIMBURSMENT CLAIM TYPE
                </h3>
                <p className="text-sm text-gray-500 roboto mt-1">
                  Select the type of claim and prepare required documents for
                  submission.
                </p>
              </div>

              {/* Tabs */}
              <div
                className={`flex bg-gray-100 p-1 rounded-lg ${claimTypeError ? "border border-red-500" : ""}`}
              >
                {Object.keys(REQ_DATA).map((key) => {
                  const labels = {
                    in_patient: "In-Patient",
                    out_patient: "Out-Patient",
                    opd_medicines: "OPD Medicines",
                  };
                  const isActive = claimType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setClaimType(key);
                        setClaimTypeError(false);
                      }}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all roboto ${
                        isActive
                          ? "bg-white text-[#0073aa] shadow-sm"
                          : "text-gray-500 hover:text-gray-700 cursor-pointer"
                      }`}
                    >
                      {labels[key]}
                    </button>
                  );
                })}
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-4 pt-4">
                {claimType && REQ_DATA[claimType] ? (
                  REQ_DATA[claimType].map((req, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl p-4 shadow-sm flex flex-col gap-2 ${
                        files[req] && files[req].length > 0
                          ? "bg-[#eef4f9] border-[#d2e3f0]"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#1E3161] text-sm">
                            {req}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Supported: PDF, JPG, PNG (Max 10MB per file)
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="bg-blue-50 text-[#0073aa] text-[11px] font-bold px-3 py-1 rounded-full">
                            {files[req] ? files[req].length : 0} files uploaded
                          </span>
                          <label className="text-[#1E3161] font-bold text-sm cursor-pointer hover:underline">
                            Upload
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) =>
                                handleFileUpload(req, e.target.files)
                              }
                            />
                          </label>
                        </div>
                      </div>
                      {files[req] && files[req].length > 0 && (
                        <div className="mt-2 space-y-2">
                          {Array.from(files[req]).map((f, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center bg-white rounded-lg p-3 text-sm border border-gray-100"
                            >
                              <span className="truncate pr-4 text-gray-700">
                                {f.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveFileRequirement(req, i)
                                }
                                className="text-red-500 hover:text-red-700 font-bold shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic p-4 text-center roboto">
                    Select a claim type above to see requirements
                  </div>
                )}
              </div>
              {claimType && (
                <div className="border border-red-500 pt-2 mx-5 p-4 rounded-lg">
                  <span className="text-sm space-y-3 pt-2 text-red-500 roboto">
                    Note: To avoid delays, kindly provide all required documents
                    when submitting your reimbursement request.
                  </span>
                </div>
              )}
            </div>
            {claimTypeError && (
              <div className="-mt-6">
                <span className="text-red-500 text-xs roboto ml-3">
                  Requirement Type is required
                </span>
              </div>
            )}

            {/* Section: Contact Information (Upload Mode) */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-[#1E3161] uppercase tracking-wider border-b pb-2 roboto">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("employee_email", { required: true })}
                    className="w-full border p-2 rounded-lg text-sm bg-white"
                  />
                  {errors.employee_email && (
                    <span className="text-red-500 text-xs roboto ml-2">
                      Email Address is required
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Terms and Agreement */}
            <div className="flex flex-col gap-2">
              <div
                className="flex gap-4 items-start p-6 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setIsTermsOpen(true)}
              >
                <input
                  type="checkbox"
                  id="privacy-consent-upload"
                  checked={privacyConsent}
                  readOnly
                  className="w-5 h-5 mt-0.5 accent-[#0073aa] cursor-pointer"
                />
                <label
                  htmlFor="privacy-consent-upload"
                  className="text-xs text-gray-600 leading-relaxed roboto cursor-pointer pointer-events-none"
                >
                  I have read, understood, and accepted the terms and agreement.
                </label>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors roboto cursor-pointer"
          >
            ← BACK
          </button>
          <button
            type="submit"
            disabled={(!isUploadOnly && !privacyConsent) || loading}
            className="w-full sm:w-auto bg-[#1E3161] text-white px-12 py-3 rounded-lg font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg roboto cursor-pointer"
          >
            {loading ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>
      </form>

      {/* Files Check Summary Modal */}
      <FilesCheckSummaryModal
        open={isSummaryModalOpen}
        onOpenChange={setIsSummaryModalOpen}
        hasMissing={hasMissing}
        uploadedReqs={uploadedReqs}
        missingReqs={missingReqs}
        files={files}
        formDataToSubmit={formDataToSubmit}
        onNext={handleFinalSubmit}
      />

      {/* Terms Modal */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-5xl w-full max-h-[80vh] flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="text-[#1E3161] font-bold text-xl roboto uppercase tracking-wide">
              Terms and Conditions
            </DialogTitle>
            <DialogDescription>
              Please read and confirm the following before submitting your
              claim/s:
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 max-h-[50vh] overflow-y-auto text-sm text-gray-600 roboto leading-relaxed">
            <ul className="space-y-4 list-disc pl-5">
              <li>
                I confirm that all information I am providing and documents I am
                submitting are true, correct, and complete to the best of my
                knowledge. I understand that providing incomplete or unclear
                information or documents may result in delays in the evaluation
                and processing of my claim. I also understand that insurance
                fraud is prohibited under the Philippine law. Submitting false,
                misleading, fraudulent, altered, exaggerated, or fabricated
                claims or supporting documents may result not only in denial of
                benefits and policy cancellation but may also subject me to
                possible civil or criminal liability under applicable
                Philippines laws.
              </li>
              <li>
                In accordance with the Data Privacy Act of 2012 (Republic Act
                No. 10173), its Implementing Rules and Regulations, and other
                applicable data protection and privacy laws, I consent to the
                collection and processing of my personal data (which may include
                identification information, contact details, financial
                information, and medical records) for the purpose of evaluating
                and settling my claim.
              </li>
              <li className="list-none pt-2">
                I acknowledge that I have read and understood LLIBI’s Privacy
                Notice, available at{" "}
                <a
                  href="https://llibi.com/corporate-governance/#DataPrivacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  https://llibi.com/corporate-governance/#DataPrivacy
                </a>
                , which explains how my personal data is collected, used,
                stored, shared, and protected. I further understand that, as a
                data subject, I have rights under the laws, which include the
                right to access, correct, update, withdraw consent, or request
                deletion of my personal data, subject to lawful limitations, and
                that I may exercise these rights in accordance with the
                procedures outlined in the Notice.
              </li>
              <li className="list-none">
                I understand that appropriate safeguards are in place to protect
                my personal data and that my information will be retained only
                for as long as necessary to fulfill legal, regulatory, and
                contractual obligations.
              </li>
              <li className="list-none pb-2">
                I agree that my information may be shared, only when necessary
                and in accordance with the laws, with authorized third parties
                such medical professionals, insurers, reinsurers, service
                providers, legal advisors, and regulatory authorities for
                legitimate insurance, compliance, and fraud prevention purposes.
              </li>
              <li>
                I confirm that all bank account and payment details provided by
                me are accurate and belong either to me or to a duly authorized
                representative. I acknowledge that any error or misdirected
                payment resulting from incorrect or incomplete banking
                information provided by me shall not render LLIBI liable. LLIBI
                shall be deemed to have fulfilled its payment obligation once
                payment has been processed based on the banking details I
                submitted.
              </li>
              <li>
                I confirm that I am the policyholder or a policyholder’s duly
                authorized representative, and I take responsibility for the
                accuracy and completeness of all information, documents, and
                bank details provided in support of this claim.
              </li>
            </ul>
          </ScrollArea>

          <DialogFooter className="flex gap-2 justify-end mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleTermsDisagree}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 roboto cursor-pointer"
            >
              Disagree
            </Button>
            <Button
              onClick={handleTermsAgree}
              className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 roboto cursor-pointer"
            >
              Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReimbursementForm;
