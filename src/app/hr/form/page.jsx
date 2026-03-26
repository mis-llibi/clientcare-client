"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Label from "@/components/Label";
import SelectComponent from "@/components/Select";
import FindHospitalDialog from "@/app/request-loa/FindHospitalDialog";

import useHrForm from "@/hooks/useHrForm";
import { useSearchParams } from "next/navigation";

export default function HrForms() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      company_id: "",
      patientFirstName: "",
      patientLastName: "",
      patientType: "employee",
      chiefComplaint: "",
      provider: "",
    },
  });

  const [selectedHospital, setSelectedHospital] = useState();
  const [loading, setLoading] = useState(false);

  const { companies, submitHrForms } = useHrForm();

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

  const onSubmit = (data) => {
    const mergeData = {
      ...data,
      user_id: Number(userId),
      company_id: Number(data.company_id),
    };

    setLoading(true);
    submitHrForms({
      ...mergeData,
      setLoading,
    });
  };

  useEffect(() => {
    if (selectedHospital)
      setValue(
        "provider",
        `${selectedHospital?.id}||${selectedHospital?.name}++${
          selectedHospital?.address
        }++${selectedHospital?.city}++${selectedHospital?.state}++${
          selectedHospital?.email1
        }`,
      );
  }, [selectedHospital]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 md:px-6 lg:px-8 roboto">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-3xl border border-slate-200 shadow-xl">
            <CardHeader className="space-y-2 border-b bg-white/80 backdrop-blur">
              <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">
                HR Patient Form
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Fill out the patient details below.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-2">
                    <SelectComponent
                      defaultValue={"employee"}
                      itemList={patientType}
                      className={"w-full border-2 roboto"}
                      control={control}
                      name={"patientType"}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="company"
                      className="text-[#1E3161] font-semibold"
                    >
                      Company
                    </label>
                    <SelectComponent
                      // defaultValue={"employee"}
                      itemList={companies}
                      className={"w-full border-2 roboto"}
                      control={control}
                      name={"company_id"}
                      rules={{ required: "Company is Required" }}
                    />
                    {errors.company_id && (
                      <p className="text-red-800 text-sm font-semibold roboto">
                        {errors.company_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="patientFirstName"
                      className="text-[#1E3161] font-semibold"
                    >
                      Patient First Name
                    </label>
                    <input
                      type="text"
                      id="patientFirstName"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("patientFirstName", {
                        required: "Patient first name is required",
                      })}
                    />
                    {errors.patientFirstName && (
                      <p className="text-red-800 text-sm font-semibold roboto">
                        {errors.patientFirstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="patientLastName"
                      className="text-[#1E3161] font-semibold"
                    >
                      Patient Last Name
                    </label>
                    <input
                      type="text"
                      id="patientLastName"
                      className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                      {...register("patientLastName", {
                        required: "Patient last name is required",
                      })}
                    />
                    {errors.patientLastName && (
                      <p className="text-red-800 text-sm font-semibold roboto">
                        {errors.patientLastName.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label
                      label={"Chief Complaint"}
                      htmlFor={"chiefComplaint"}
                    />
                    <textarea
                      id="chiefComplaint"
                      className="border border-black/30 w-full py-2 px-2 rounded-lg outline-[#1E3161] roboto resize-y min-h-[100px]"
                      {...register("chiefComplaint", {
                        required: "Chief Complaint is required",
                      })}
                      // placeholder="Chief complaint is required"
                    />
                    {errors.chiefComplaint && (
                      <p className="text-red-800 text-sm font-semibold roboto">
                        {errors.chiefComplaint.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex flex-col w-full">
                      <Label
                        label={
                          "Find your preferred accredited provider (Hospital / Clinic)"
                        }
                      />
                      <FindHospitalDialog
                        setSelectedHospital={setSelectedHospital}
                        loaType={"hrCall"}
                      />
                      <input
                        type="hidden"
                        {...register("provider", {
                          required:
                            "You must select Hospital or Clinic to complete the assessment",
                        })}
                      />
                      {errors?.provider && (
                        <h1 className="text-red-800 text-sm font-semibold roboto">
                          {errors?.provider?.message}
                        </h1>
                      )}
                    </div>

                    {selectedHospital && (
                      <>
                        <div
                          className={`flex flex-col md:flex-row p-2 border border-gray-400 border-dashed bg-gray-100 roboto`}
                        >
                          <div className="basis-1/2 text-sm">
                            <p className="font-bold mb-1">
                              Hospital / Clinic:{" "}
                              <span className="font-normal">
                                {selectedHospital.name}
                              </span>
                            </p>
                            <p className="font-bold mb-1">
                              Address:{" "}
                              <span className="font-normal">
                                {selectedHospital.address}
                              </span>
                            </p>
                            <p className="font-bold mb-1">
                              City:{" "}
                              <span className="font-normal">
                                {selectedHospital.city}
                              </span>
                            </p>
                            <p className="font-bold mb-1">
                              State:{" "}
                              <span className="font-normal">
                                {selectedHospital.state}
                              </span>
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl md:w-auto"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
