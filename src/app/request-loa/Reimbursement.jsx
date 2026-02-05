import React, { useEffect, useState } from "react";

import SelectComponent from "@/components/Select";
import PhoneInputMask from "@/components/InputMask";
import { MoonLoader } from "react-spinners";

// Hooks
import { useForm, Controller } from "react-hook-form";
import { ClientRequestDesktop } from "@/hooks/ClientRequestDesktop";
import Swal from "sweetalert2";
import ClientErrorLogForm from "./ClientErrorLogForm";
import ReimbursementFormModal from "./ReimbursementFormModal";

function Reimbursement() {
  const [loading, setLoading] = useState(false);

  const [errorLogs, setErrorLogs] = useState([]);
  const [showErrorLogsModal, setShowErrorLogsModal] = useState(false);
  const [showReimbursementModal, setShowReimbursementModal] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);

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
      loaType: "reimbursement",
    },
  });

  const { verifyReimbursement } = ClientRequestDesktop();

  const patientType = [
    {
      name: "Patient is Employee",
      value: "employee",
    },
    {
      name: "Patient is Dependent",
      value: "dependent",
    },
  ];

  const verificationDetailsType = watch("verificationDetailsType");
  const typeOfPatient = watch("patientType");

  useEffect(() => {
    reset({
      patientType: typeOfPatient, // keep current patient type
      verificationDetailsType, // keep selected type
      erCardNumber: "",
      patientLastName: "",
      patientFirstName: "",
      dob: "",
      loaType: "reimbursement",
    });
  }, [verificationDetailsType, typeOfPatient, reset]);

  const onSubmit = (data) => {
    if (data.email == data.alt_email) {
      Swal.fire({
        title: "Email duplicate",
        text: "Your email is duplicated, change the alternate email",
        icon: "warning",
      });
      return;
    }
    if (data.contact) {
      const digits = data.contact.replace(/\D/g, ""); // remove all non-digits
      // ensure it starts with 0 (not +63)
      if (digits.startsWith("63")) {
        data.contact = "0" + digits.slice(2);
      } else if (!digits.startsWith("0")) {
        data.contact = "0" + digits;
      }
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Once you click Submit, your information will be validated.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm",
      customClass: {
        title: "roboto",
        htmlContainer: "roboto", // applies to text
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        verifyReimbursement({
          formData: data,
          setLoading,
          reset,
          setErrorLogs,
          setShowErrorLogsModal,
          cb: (res) => {
            setVerifiedData({
              ...res,
              member_id: res.member_id,
              contact: data.contact,
              email: data.email,
            });
            setShowReimbursementModal(true);
          },
        });
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center my-2">
          <h1 className="text-[#1E3161] font-bold roboto text-lg">
            REIMBURSEMENT
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <SelectComponent
              defaultValue={"employee"}
              itemList={patientType}
              className={"w-full border-2 roboto"}
              control={control}
              name={"patientType"}
            />
          </div>

          <div className="flex">
            <div className="basis-1/2 flex items-center gap-1">
              <input
                type="radio"
                id="personal_details"
                value="personal"
                {...register("verificationDetailsType")}
                className="w-4 h-4 accent-[#1E3161]"
              />
              <label
                htmlFor="personal_details"
                className="text-[11px] roboto font-bold text-[#1E3161]"
              >
                Use Personal Details
              </label>
            </div>

            <div className="basis-1/2 flex items-center gap-1">
              <input
                type="radio"
                id="insurance_details"
                value="insurance"
                {...register("verificationDetailsType")}
                className="w-4 h-4 accent-[#1E3161]"
              />
              <label
                htmlFor="insurance_details"
                className="text-[11px] roboto font-bold text-[#1E3161]"
              >
                Use Insurance Details
              </label>
            </div>
          </div>

          <div>
            <h1 className="font-bold roboto">
              Patient Information (as shown in Emergency Room card)
            </h1>
            {verificationDetailsType === "insurance" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                  <div>
                    <label
                      htmlFor="er_card"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      ER Card #
                    </label>
                    <input
                      type="text"
                      id="er_card"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("erCardNumber", {
                        required: "ER Card # is required",
                      })}
                    />
                    {errors?.erCardNumber && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.erCardNumber?.message}
                      </h1>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="dob"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto bg-gray-100"
                      {...register("dob", {
                        required: "Date of Birth is required",
                      })}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    {errors?.dob && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.dob?.message}
                      </h1>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label
                      htmlFor="last_name"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("patientLastName", {
                        required: "Last Name is required",
                      })}
                    />
                    {errors?.patientLastName && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.patientLastName?.message}
                      </h1>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="first_name"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("patientFirstName", {
                        required: "First Name is required",
                      })}
                    />
                    {errors?.patientFirstName && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.patientFirstName?.message}
                      </h1>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="dob"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto bg-gray-100"
                      {...register("dob", {
                        required: "Date of Birth is required",
                      })}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    {errors?.dob && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.dob?.message}
                      </h1>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {typeOfPatient == "dependent" && (
            <>
              <div>
                <h1 className="font-bold roboto">Employee Information</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="last_name"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("employeeLastName", {
                        required: "Last Name is required",
                      })}
                    />
                    {errors?.employeeLastName && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.employeeLastName?.message}
                      </h1>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="first_name"
                      className="text-[#1E3161] font-semibold roboto"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("employeeFirstName", {
                        required: "First Name is required",
                      })}
                    />
                    {errors?.employeeFirstName && (
                      <h1 className="text-red-800 text-sm font-semibold roboto">
                        {errors?.employeeFirstName?.message}
                      </h1>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-2 mt-5 bg-[#E7E7E7]"></div>

        <div className="mt-5 flex flex-col gap-3">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="email"
                  className="text-[#1E3161] font-semibold roboto"
                >
                  Email <span className="text-red-700 text-sm">(required)</span>
                </label>
                <input
                  type="text"
                  id="email"
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors?.email && (
                  <h1 className="text-red-800 text-sm font-semibold roboto">
                    {errors?.email?.message}
                  </h1>
                )}
              </div>
              <div>
                <label
                  htmlFor="alt_email"
                  className="text-[#1E3161] font-semibold roboto"
                >
                  Alternate Email (optional)
                </label>
                <input
                  type="text"
                  id="alt_email"
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                  {...register("alt_email")}
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="text-[#1E3161] font-semibold roboto"
                >
                  Contact #
                </label>
                <Controller
                  name="contact"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInputMask
                      value={value || ""}
                      onChange={onChange}
                      placeholder="+63 (___)-___-____"
                      className="roboto"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <>
              <div className="bg-[#1E3161] text-white py-2 rounded-r-4xl cursor-pointer rounded-bl-4xl flex items-center justify-center">
                <MoonLoader size={20} color="white" />
              </div>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="bg-[#1E3161] text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950 roboto"
              >
                SUBMIT
              </button>
            </>
          )}
        </div>
      </form>

      {showErrorLogsModal && (
        <ClientErrorLogForm
          onClose={() => setShowErrorLogsModal(false)}
          errorData={errorLogs}
        />
      )}

      {showReimbursementModal && (
        <ReimbursementFormModal
          onClose={() => setShowReimbursementModal(false)}
          initialData={verifiedData}
        />
      )}
    </>
  );
}

export default Reimbursement;
