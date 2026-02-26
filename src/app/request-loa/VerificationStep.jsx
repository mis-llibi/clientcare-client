import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import SelectComponent from "@/components/Select";
import PhoneInputMask from "@/components/InputMask";
import { MoonLoader } from "react-spinners";
import Swal from "sweetalert2";
import { ClientRequestDesktop } from "@/hooks/ClientRequestDesktop";
import ClientErrorLogForm from "./ClientErrorLogForm";

const VerificationStep = ({ onVerify, onBack, initialData }) => {
  const [loading, setLoading] = React.useState(false);
  const [errorLogs, setErrorLogs] = React.useState([]);
  const [showErrorLogsModal, setShowErrorLogsModal] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientType: "employee",
      verificationDetailsType: "personal",
      erCardNumber: "",
      patientLastName: "",
      patientFirstName: "",
      dob: "",
      email: "",
      contact: "",
      loaType: "reimbursement",
      ...initialData,
    },
  });

  const { verifyReimbursement } = ClientRequestDesktop();

  const patientType = [
    { name: "Patient is Employee", value: "employee" },
    { name: "Patient is Dependent", value: "dependent" },
  ];

  const verificationDetailsType = watch("verificationDetailsType");
  const typeOfPatient = watch("patientType");

  const onSubmit = (data) => {
    if (data.contact) {
      const digits = data.contact.replace(/\D/g, "");
      if (digits.startsWith("63")) {
        data.contact = "0" + digits.slice(2);
      } else if (!digits.startsWith("0")) {
        data.contact = "0" + digits;
      }
    }

    setLoading(true);
    verifyReimbursement({
      formData: data,
      setLoading,
      reset,
      setErrorLogs,
      setShowErrorLogsModal,
      cb: (res) => {
        onVerify({
          ...res,
          patientLastName: data.patientLastName,
          patientFirstName: data.patientFirstName,
          dob: data.dob,
          contact: data.contact,
          email: data.email,
          patientType: data.patientType,
        });
      },
    });
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto py-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#1E3161] roboto">
            MEMBER VERIFICATION
          </h2>
          <p className="text-gray-500 text-sm roboto">
            Please verify your membership to proceed.
          </p>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className="block text-xs font-bold text-[#1E3161] mb-2 uppercase tracking-wider roboto">
              Patient Type
            </label>
            <SelectComponent
              defaultValue={"employee"}
              itemList={patientType}
              className={"w-full border-gray-300 roboto rounded-lg bg-white"}
              control={control}
              name={"patientType"}
            />
          </div>

          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                value="personal"
                {...register("verificationDetailsType")}
                className="w-4 h-4 accent-[#1E3161] bg-white"
              />
              <span className="text-sm font-bold text-[#1E3161] roboto group-hover:text-blue-800">
                Use Personal Details
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                value="insurance"
                {...register("verificationDetailsType")}
                className="w-4 h-4 accent-[#1E3161] bg-white"
              />
              <span className="text-sm font-bold text-[#1E3161] roboto group-hover:text-blue-800">
                Use Insurance Details
              </span>
            </label>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-bold text-[#1E3161] mb-4 roboto uppercase">
              Patient Information
            </h4>

            {verificationDetailsType === "insurance" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    ER Card #
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Card Number"
                    className={`w-full border ${errors.erCardNumber ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("erCardNumber", {
                      required: "ER Card Number is required.",
                    })}
                  />
                  {errors.erCardNumber && (
                    <span className="text-red-500 text-xs">
                      {errors.erCardNumber.message}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`w-full border ${errors.dob ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("dob", {
                      required: "Date of Birth is required.",
                    })}
                  />
                  {errors.dob && (
                    <span className="text-red-500 text-xs">
                      {errors.dob.message}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={`w-full border ${errors.patientLastName ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("patientLastName", {
                      required: "Last Name is required.",
                    })}
                  />
                  {errors.patientLastName && (
                    <span className="text-red-500 text-xs">
                      {errors.patientLastName.message}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className={`w-full border ${errors.patientFirstName ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("patientFirstName", {
                      required: "First Name is required.",
                    })}
                  />
                  {errors.patientFirstName && (
                    <span className="text-red-500 text-xs">
                      {errors.patientFirstName.message}
                    </span>
                  )}
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`w-full border ${errors.dob ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("dob", {
                      required: "Date of Birth is required.",
                    })}
                  />
                  {errors.dob && (
                    <span className="text-red-500 text-xs">
                      {errors.dob.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {typeOfPatient === "dependent" && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-bold text-[#1E3161] mb-4 roboto uppercase">
                Employee Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={`w-full border ${errors.employeeLastName ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("employeeLastName", {
                      required: "Last Name is required.",
                    })}
                  />
                  {errors.employeeLastName && (
                    <span className="text-red-500 text-xs">
                      {errors.employeeLastName.message}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className={`w-full border ${errors.employeeFirstName ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    {...register("employeeFirstName", {
                      required: "First Name is required.",
                    })}
                  />
                  {errors.employeeFirstName && (
                    <span className="text-red-500 text-xs">
                      {errors.employeeFirstName.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-bold text-[#1E3161] mb-4 roboto uppercase">
              Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                  {...register("email", {
                    required: "Email Address is required.",
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase roboto">
                  Contact #
                </label>
                <Controller
                  name="contact"
                  control={control}
                  rules={{ required: "Contact Number is required." }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInputMask
                      value={value || ""}
                      onChange={onChange}
                      placeholder="+63 (___)-___-____"
                      className={`w-full border ${errors.contact ? "border-red-500" : "border-gray-300"} p-2 rounded-lg outline-[#1E3161] text-sm bg-white`}
                    />
                  )}
                />
                {errors.contact && (
                  <span className="text-red-500 text-xs">
                    {errors.contact.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

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
            disabled={loading}
            className="w-full sm:w-auto bg-[#1E3161] text-white px-12 py-3 rounded-lg font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg roboto cursor-pointer"
          >
            {loading ? (
              <MoonLoader size={18} color="white" />
            ) : (
              "VERIFY MEMBERSHIP"
            )}
          </button>
        </div>
      </form>

      {showErrorLogsModal && (
        <ClientErrorLogForm
          onClose={() => setShowErrorLogsModal(false)}
          errorData={errorLogs}
        />
      )}
    </div>
  );
};

export default VerificationStep;
