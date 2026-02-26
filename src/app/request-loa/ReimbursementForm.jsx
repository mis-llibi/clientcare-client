import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInputMask from "@/components/InputMask";

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

  const calculateDefaultAccountName = () => {
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
      account_name: calculateDefaultAccountName(),
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

    onNext({ ...data, ...claimTypes });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!claimType) {
      setClaimTypeError(true);
    }
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Section: Requirement Type */}
        {!isUploadOnly && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#1E3161] uppercase roboto">
                SELECT REQUIREMENT TYPE
              </h3>
              <p className="text-sm text-gray-500 roboto mt-1">
                Please select the type of claim and check the requirements you
                have ready.
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
            <div className="space-y-3 pt-2">
              {claimType && REQ_DATA[claimType] ? (
                REQ_DATA[claimType].map((req, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 border-b border-gray-300"
                  >
                    <span className="text-sm text-[#1E3161]-600 roboto px-7">
                      {req}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-sm text-[#1E3161]-500 italic p-4 text-center roboto">
                  Select a claim type above to see requirements
                </div>
              )}
            </div>
            {claimType && (
              <div className="border border-red-500 pt-2 mx-5 p-4 rounded-lg">
                <span className="text-sm space-y-3 pt-2 text-red-500 roboto">
                  Note: Please have all the necessary documents needed to
                  process your claim reimbursement ready for uploading.
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
                      Bank Name
                    </label>
                    <input
                      {...register("bank_name")}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Account Number
                    </label>
                    <input
                      {...register("account_number")}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Account Name
                    </label>
                    <input
                      {...register("account_name")}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Account Holder Address
                    </label>
                    <input
                      {...register("account_holder_address")}
                      className="w-full border p-2 rounded-lg text-sm bg-white"
                    />
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
          </>
        )}

        {isUploadOnly && (
          <>
            {/* Section: Requirement Type (Upload Mode) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#1E3161] uppercase roboto">
                  SELECT REQUIREMENT TYPE
                </h3>
                <p className="text-sm text-gray-500 roboto mt-1">
                  Please select the type of claim you are submitting.
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

              {/* Requirements List (Upload Mode) */}
              <div className="space-y-3 pt-2">
                {claimType && REQ_DATA[claimType] ? (
                  REQ_DATA[claimType].map((req, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 border-b border-gray-300"
                    >
                      <span className="text-sm text-[#1E3161]-600 roboto px-7">
                        {req}
                      </span>
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
                    Note: Please have all the necessary documents needed to
                    process your claim reimbursement ready for uploading.
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
            className="w-full sm:w-auto bg-[#1E3161] text-white px-12 py-3 rounded-lg font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg roboto cursor-pointer"
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReimbursementForm;
