import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { MoonLoader } from "react-spinners";
import FileUpload from "@/components/Fileupload";
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

const UploadStep = ({ verifiedData, mode, formData, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const { submitReimbursement, submitReimbursementByFiles } =
    ClientRequestDesktop();

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      in_patient: formData?.in_patient || false,
      out_patient: formData?.out_patient || false,
      opd_medicines: formData?.opd_medicines || false,
    },
  });

  const uploadedFiles = watch("files");
  const fileArray = uploadedFiles ? Array.from(uploadedFiles) : [];

  const handleRemoveFile = ({ fileToRemove, index }) => {
    const newFiles = [...fileArray];
    newFiles.splice(index, 1);

    setValue("files", newFiles.length === 0 ? null : newFiles, {
      shouldValidate: true,
    });
  };

  const handleTermsAgree = () => {
    setPrivacyConsent(true);
    setIsTermsOpen(false);
  };

  const handleTermsDisagree = () => {
    setPrivacyConsent(false);
    setIsTermsOpen(false);
  };

  const onSubmit = async (data) => {
    if (fileArray.length === 0) return;

    setLoading(true);
    const finalFormData = new FormData();

    // Hardcode request-origin for both modes
    finalFormData.append("request-origin", "client-care");

    // === Upload Manual Form Mode ===
    if (mode === "upload") {
      if (verifiedData?.member_id) {
        finalFormData.append("member_id", verifiedData.member_id);
      }
      // Pass email from previous step (or verifiedData)
      finalFormData.append(
        "email",
        formData.employee_email || verifiedData?.email || "",
      );

      // Determine requirement_type based on booleans or explicit field
      let reqType = "";
      if (formData.in_patient || formData.claimType === "in_patient")
        reqType = "in_patient";
      else if (formData.out_patient || formData.claimType === "out_patient")
        reqType = "out_patient";
      else if (formData.opd_medicines || formData.claimType === "opd_medicines")
        reqType = "opd_medicines";

      finalFormData.append("requirement_type", reqType);

      // Append Files
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file) => {
          finalFormData.append("files[]", file);
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
      return;
    }

    // === Regular Online Reimbursement Mode ===

    // 1. Append verified member ID
    if (verifiedData?.member_id) {
      finalFormData.append("member_id", verifiedData.member_id);
    }

    // ... existing online flow logic ...
    Object.keys(formData).forEach((key) => {
      if (!["in_patient", "out_patient", "opd_medicines"].includes(key)) {
        finalFormData.append(key, formData[key]);
      }
    });

    const claimTypes = ["in_patient", "out_patient", "opd_medicines"];
    claimTypes.forEach((key) => {
      const val = formData[key] ? "1" : "0";
      finalFormData.append(key, val);
    });

    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach((file) => {
        finalFormData.append("files[]", file);
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
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in bg-white rounded-xl">
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
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section: Files */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
          <h4 className="text-sm font-bold text-[#1E3161] uppercase tracking-wider border-b pb-2 roboto">
            Upload Documents
          </h4>
          <p className="text-xs text-gray-500 roboto">
            Supported formats: PDF, JPG, PNG. Max size: 5MB per file.
          </p>

          <FileUpload
            control={control}
            name="files"
            multiple={true}
            className="max-w-full bg-white"
          />
          {errors.files && <p className="text-red-500 text-xs">Required</p>}

          {fileArray.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {fileArray.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FaFileAlt className="text-[#0073aa] flex-shrink-0" />
                    <span className="text-xs truncate font-medium roboto">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile({ fileToRemove: file, index: i })
                    }
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <HiMiniXMark size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Consent */}
        <div className="flex flex-col gap-2">
          <div
            className="flex gap-4 items-start p-6 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => setIsTermsOpen(true)}
          >
            <input
              type="checkbox"
              id="privacy-consent"
              checked={privacyConsent}
              readOnly
              // Using readOnly because toggle is handled by modal/block click
              className="w-5 h-5 mt-0.5 accent-[#0073aa] cursor-pointer"
            />
            <label
              htmlFor="privacy-consent"
              className="text-xs text-gray-600 leading-relaxed roboto cursor-pointer pointer-events-none"
            >
              I have read, understood, and accepted the terms and agreement.
            </label>
          </div>

          {/* Validation Message for Files */}
          {fileArray.length === 0 && (
            <p className="text-red-500 text-xs italic roboto px-2">
              * Please upload at least one document to proceed.
            </p>
          )}
        </div>

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
            disabled={loading || !privacyConsent || fileArray.length === 0}
            className="w-full sm:w-auto bg-[#0073aa] text-white px-12 py-3 rounded-lg font-bold hover:bg-[#005f8d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg roboto cursor-pointer"
          >
            {loading ? <MoonLoader size={20} color="white" /> : "SUBMIT CLAIM"}
          </button>
        </div>
      </form>

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

export default UploadStep;
