"use client";
import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import Card from "@/components/ClientCare/Card";
import SelectComponent from "@/components/Select";
import { useClientRequest } from "@/hooks/useClientRequest";


function ProviderClientRequest({ provider, loa_type }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      patientType: "employee",
      verificationDetailsType: "insurance",
      erCardNumber: "",
      patientLastName: "",
      patientFirstName: "",
      dob: "",
    },
  });

  const { submitClient } = useClientRequest()

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

  const typeOfPatient = watch("patientType");
  const verificationDetailsType = watch("verificationDetailsType");

  const onSubmit = (data) => {
    setLoading(true)
    submitClient({
        ...data,
        setLoading
    })
  };

  useEffect(() => {
    reset({
      patientType: typeOfPatient, // keep current patient type
      verificationDetailsType, // keep selected type
      erCardNumber: "",
      patientLastName: "",
      patientFirstName: "",
      dob: "",
    });
  }, [verificationDetailsType, typeOfPatient, reset]);


  return (
    <>
      <Card>
        <h1 className="text-center text-[#1E3161] font-bold roboto">
          {provider?.provider}
        </h1>
        <h1 className="text-center text-[#1E3161] font-bold roboto">
          {loa_type.slice(0,1).toUpperCase() + loa_type.slice(1)}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...register("provider_id", {
              value: provider?.provider_id,
            })}
          />
          <input
            type="hidden"
            {...register("provider", {
              value: provider?.provider,
            })}
          />
          <input
            type="hidden"
            {...register("provider_email", {
              value: provider?.email,
            })}
          />
          <input 
            type="hidden" 
            {...register('loa_type', {
              value: loa_type
            })}
          />

          <div className="flex flex-col gap-3">
            <div className="w-full flex items-center gap-2">
              <SelectComponent
                defaultValue={"employee"}
                itemList={patientType}
                className={"w-full border-2"}
                control={control}
                name={"patientType"}
              />
            </div>

            <div className="flex">
              <div className="basis-1/2 flex items-center gap-1">
                <input
                  type="radio"
                  id="insurance_details"
                  value="insurance" // 👈 added value
                  {...register("verificationDetailsType")} // 👈 register here
                  className="w-4 h-4 accent-[#1E3161]"
                />
                <label
                  htmlFor="insurance_details"
                  className="text-[11px] roboto font-bold text-[#1E3161]"
                >
                  Use Insurance Details
                </label>
              </div>

              <div className="basis-1/2 flex items-center gap-1">
                <input
                  type="radio"
                  id="personal_details"
                  value="personal" // 👈 added value
                  {...register("verificationDetailsType")} // 👈 register here too
                  className="w-4 h-4 accent-[#1E3161]"
                />
                <label
                  htmlFor="personal_details"
                  className="text-[11px] roboto font-bold text-[#1E3161]"
                >
                  Use Personal Details
                </label>
              </div>
            </div>

            <div className="border-2 rounded-lg py-2 px-3 border-black/30 shadow-[3px_3px_4px_0px_rgba(0,0,0,0.25)]">
              <h1 className="font-bold roboto">Patient Information</h1>
              <div className="mt-2 flex flex-col gap-2">

                {/* Insurance Details */}
                {verificationDetailsType == "insurance" ? (
                  <>
                  <div>
                    <label htmlFor="er_card" className="text-[#1E3161] font-semibold">ER Card #</label>
                    <input 
                      type="text" 
                      id="er_card" 
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                      {...register('erCardNumber', {
                        required: "ER Card # is required"
                      })}
                      />
                      {errors?.erCardNumber && <h1 className="text-red-800 text-sm font-semibold">{errors?.erCardNumber?.message}</h1>}
                  </div>

                  <div>
                    <label htmlFor="dob" className="text-[#1E3161] font-semibold">Date of Birth</label>
                    <input 
                      type="date" 
                      id="dob" 
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                      {...register('dob', {
                        required: "Date of Birth is required"
                      })}
                      />
                      {errors?.dob && <h1 className="text-red-800 text-sm font-semibold">{errors?.dob?.message}</h1>}
                  </div>

                  </>
                ) : (
                  <>
                  <div>
                    <label htmlFor="last_name" className="text-[#1E3161] font-semibold">Last Name</label>
                    <input 
                      type="text" 
                      id="last_name" 
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                      {...register('patientLastName', {
                        required: "Last Name is required"
                      })}
                      />
                      {errors?.patientLastName && <h1 className="text-red-800 text-sm font-semibold">{errors?.patientLastName?.message}</h1>}
                  </div>

                  <div>
                    <label htmlFor="first_name" className="text-[#1E3161] font-semibold">First Name</label>
                    <input 
                      type="text" 
                      id="first_name" 
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                      {...register('patientFirstName', {
                        required: "First Name is required"
                      })}
                      />
                      {errors?.patientFirstName && <h1 className="text-red-800 text-sm font-semibold">{errors?.patientFirstName?.message}</h1>}
                  </div>

                  <div>
                    <label htmlFor="dob" className="text-[#1E3161] font-semibold">Date of Birth</label>
                    <input 
                      type="date" 
                      id="dob" 
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                      {...register('dob', {
                        required: "Date of Birth is required"
                      })}
                      />
                      {errors?.dob && <h1 className="text-red-800 text-sm font-semibold">{errors?.dob?.message}</h1>}
                  </div>
                  </>

                )}

              </div>

              {typeOfPatient == "dependent" && (
                <h1 className="font-bold roboto mt-2">Employee Information</h1>
              )}
              <div className="mt-2 flex flex-col gap-2">
                {typeOfPatient == "dependent" && (
                  <>
                <div>
                  <label htmlFor="last_name">Last Name</label>
                  <input 
                    type="text" 
                    id="last_name" 
                    className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                    {...register('employeeLastName', {
                      required: "Last Name is required"
                    })}
                    />
                    {errors?.employeeLastName && <h1 className="text-red-800 text-sm font-semibold">{errors?.employeeLastName?.message}</h1>}
                </div>

                <div>
                  <label htmlFor="first_name">First Name</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                    {...register('employeeFirstName', {
                      required: "First Name is required"
                    })}
                    />
                    {errors?.employeeFirstName && <h1 className="text-red-800 text-sm font-semibold">{errors?.employeeFirstName?.message}</h1>}
                </div>
                  
                  
                  </>
                )}

                {loading ? (
                    <>
                    <div className='bg-[#1E3161] text-white py-2 rounded-r-4xl cursor-pointer rounded-bl-4xl flex items-center justify-center'>
                        <MoonLoader size={20} color='white' />
                    </div>
                    </>
                ) : (
                    <>
                    <button type="submit" className="bg-[#1E3161] text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950">SUBMIT</button>
                    </>
                )}


              </div>
            </div>


          </div>
        </form>
      </Card>
    </>
  );
}

export default ProviderClientRequest;
