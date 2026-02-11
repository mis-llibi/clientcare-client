import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { HiXMark } from "react-icons/hi2";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { MoonLoader } from "react-spinners";
import FileUpload from "@/components/Fileupload";
import PhoneInputMask from "@/components/InputMask";
import { ClientRequestDesktop } from "@/hooks/ClientRequestDesktop";

const ReimbursementFormModal = ({ onClose, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const { submitReimbursement } = ClientRequestDesktop();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      patient_full_name: initialData?.patient_name || "",
      employee_full_name: initialData?.employee_name || "",
      company_name: initialData?.company_name || "",
      employee_email: initialData?.email || "",
      mobile_number: initialData?.contact || "",
      mode_of_payment: "",
      account_name: "",
      account_holder_address: "",
      bank_name: "",
      account_number: "",
      date_submission: new Date().toISOString().split("T")[0],
      date_availment: "",
      in_patient: false,
      out_patient: false,
      opd_medicines: false,
      request_origin: "client-care",
    },
  });

  const uploadedFiles = watch("files");
  const fileArray = uploadedFiles ? Array.from(uploadedFiles) : [];

  const handleRemoveFile = (fileToRemove) => {
    const remaining = fileArray.filter((f) => f !== fileToRemove);
    setValue("files", remaining.length === 0 ? null : remaining, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
    if (!privacyConsent) {
      alert("Please accept the Privacy Notice to continue.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append member_id from validated data
    if (initialData?.member_id) {
      formData.append("member_id", initialData.member_id);
    }

    // Append text fields
    Object.keys(data).forEach((key) => {
      if (key !== "files") {
        // Convert boolean fields to 0 or 1 for Laravel
        if (
          key === "in_patient" ||
          key === "out_patient" ||
          key === "opd_medicines"
        ) {
          formData.append(key, data[key] ? "1" : "0");
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Append files
    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach((file) => {
        formData.append("files[]", file);
      });
    }

    await submitReimbursement({
      formData,
      setLoading,
      showAlert: false,
      reset: () => {
        reset();
        setShowSuccess(true);
      },
    });
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <FaCheckCircle className="text-green-600 text-6xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#1E3161] mb-3 roboto">
              Submission Received!
            </h3>
            <p className="text-gray-600 roboto">
              Your reimbursement documents have been successfully submitted.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-[#1E3161] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors w-full roboto"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#1E3161] to-blue-900">
          <h2 className="text-xl font-bold text-white roboto">
            Reimbursement Claim
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <HiXMark size={24} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="reimbursement-modal-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Section: Personal Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Personal Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Patient Full Name
                  </label>
                  <input
                    {...register("patient_full_name", { required: true })}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Employee Full Name
                  </label>
                  <input
                    {...register("employee_full_name", { required: true })}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Company Name
                  </label>
                  <input
                    {...register("company_name", { required: true })}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section: Contact Information */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("employee_email", { required: true })}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Mobile Number
                  </label>
                  <Controller
                    name="mobile_number"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <PhoneInputMask
                        {...field}
                        className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section: Payment Mode */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Preferred Mode of Payment
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...register("mode_of_payment")}
                    value="1"
                    className="w-4 h-4 accent-[#1E3161]"
                  />
                  <span className="text-sm roboto">Check Payment</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...register("mode_of_payment")}
                    value="0"
                    className="w-4 h-4 accent-[#1E3161]"
                  />
                  <span className="text-sm roboto">
                    Electronic Bank Transfer
                  </span>
                </label>
              </div>
            </div>

            {/* Section: Bank Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Bank Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Account Name
                  </label>
                  <input
                    {...register("account_name")}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Bank Name
                  </label>
                  <input
                    {...register("bank_name")}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Account Number
                  </label>
                  <input
                    {...register("account_number")}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Account Holder Address
                  </label>
                  <input
                    {...register("account_holder_address")}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section: Submission Dates */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Submission
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Date of Submission
                  </label>
                  <input
                    type="date"
                    {...register("date_submission")}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1E3161] block mb-1 roboto">
                    Date of Availment / Discharge
                  </label>
                  <input
                    type="date"
                    {...register("date_availment", { required: true })}
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Section: Basic Requirements */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Basic Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* IN-PATIENT */}
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                  <label className="flex items-center justify-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      {...register("in_patient")}
                      className="w-4 h-4 accent-[#1E3161]"
                    />
                    <span className="font-bold text-sm roboto text-[#1E3161]">
                      IN-PATIENT
                    </span>
                  </label>
                  <ul className="text-xs space-y-1.5 text-gray-700 roboto">
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Accomplished Reimbursement Form</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Valid Government ID</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Statement of Account</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Itemized Statement of Account</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Medical Certificate with Diagnosis</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>
                        Official Receipts of Hospital Charges and/or
                        Professional Fees
                      </span>
                    </li>
                  </ul>
                </div>

                {/* OUT-PATIENT */}
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                  <label className="flex items-center justify-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      {...register("out_patient")}
                      className="w-4 h-4 accent-[#1E3161]"
                    />
                    <span className="font-bold text-sm roboto text-[#1E3161]">
                      OUT-PATIENT
                    </span>
                  </label>
                  <ul className="text-xs space-y-1.5 text-gray-700 roboto">
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Accomplished Reimbursement Form</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Valid Government ID</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Doctor's Laboratory Request</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Medical Certificate with Diagnosis</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>
                        Official Receipts of Hospital Charges and/or
                        Professional Fees
                      </span>
                    </li>
                  </ul>
                </div>

                {/* OPD MEDICINES */}
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow">
                  <label className="flex items-center justify-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      {...register("opd_medicines")}
                      className="w-4 h-4 accent-[#1E3161]"
                    />
                    <span className="font-bold text-sm roboto text-[#1E3161]">
                      OPD MEDICINES
                    </span>
                  </label>
                  <ul className="text-xs space-y-1.5 text-gray-700 roboto">
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Accomplished Reimbursement Form</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Valid Government ID</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Medical Certificate with Diagnosis</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Medicine Prescription</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#1E3161] font-bold">•</span>
                      <span>Official Receipts of Medicines</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section: Disclaimer */}
            <div className="space-y-3 border-t pt-4 bg-amber-50 p-4 rounded-lg">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Disclaimer
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed roboto">
                Submission of claim documents does not guarantee approval of
                your claim. Your claim will be reviewed and evaluated based on
                documents submitted and subject to limits and conditions of your
                policy. LLIBI reserves the right to deny a claim or a portion
                thereof even with submission of complete requirements. LLIBI
                also reserves the right to require additional documents to
                complete the review and evaluation of claims.
              </p>
              <h4 className="font-bold text-[#1E3161] text-base mt-4 roboto">
                Notes
              </h4>
              <ol className="text-xs text-gray-700 space-y-1.5 list-decimal pl-5 roboto">
                <li>
                  The approved claim amount shall be payable to the employee
                  only, consistent with the elected mode of payment.
                </li>
                <li>
                  GCash, PayMaya and other e-wallets are not allowed for
                  crediting payment.
                </li>
                <li>
                  Please sign using manual/physical signature only. Claims with
                  digital/e-signature will not be processed.
                </li>
                <li>
                  For softcopy submission, official receipts must be scanned or
                  photographed. Photocopies of official receipts will not be
                  accepted.
                </li>
              </ol>
            </div>

            {/* Section: Files */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="font-bold text-[#1E3161] text-base roboto">
                Upload Supporting Documents (Optional)
              </h4>
              <p className="text-xs text-gray-600 mb-3 roboto">
                You may upload your supporting documents here (Government ID,
                receipts, etc.)
              </p>
              <FileUpload
                control={control}
                name="files"
                multiple={true}
                className="max-w-full"
              />

              {fileArray.length > 0 && (
                <div className="space-y-2 mt-3">
                  {fileArray.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1E3161] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FaFileAlt className="text-[#1E3161] flex-shrink-0 text-lg" />
                        <span className="text-xs truncate roboto">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 p-1 hover:bg-red-50 rounded"
                      >
                        <HiMiniXMark size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Consent */}
            <div className="flex gap-3 items-start border-t pt-4 bg-blue-50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="privacy-consent"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#1E3161] flex-shrink-0"
              />
              <label
                htmlFor="privacy-consent"
                className="text-xs text-gray-700 leading-relaxed roboto"
              >
                By clicking Submit, you confirm that you have read and
                understood{" "}
                <a
                  href="https://llibi.site/wp-content/uploads/2025/09/LLIBI-Privacy-Notice-Website-rev.-2025-v2-september-updated.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  LLIBI's Privacy Notice
                </a>{" "}
                and consent to the collection and use of your personal data for
                claims handling purposes.
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs font-semibold text-gray-700 roboto">
            📋 Please have your ER card ready for verification.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors roboto text-sm"
            >
              Cancel
            </button>
            <button
              form="reimbursement-modal-form"
              type="submit"
              disabled={loading || !privacyConsent}
              className="flex-1 sm:flex-none bg-[#1E3161] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed roboto text-sm shadow-lg"
            >
              {loading ? (
                <>
                  <MoonLoader size={16} color="white" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReimbursementFormModal;
