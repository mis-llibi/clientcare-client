"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ClientRequestDesktop } from "@/hooks/ClientRequestDesktop";
import { MoonLoader } from "react-spinners";
import Label from "@/components/Label";
import Input from "@/components/Input";

function FollowUpRequest() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { submitFollowupRequest } = ClientRequestDesktop();

  const onSubmit = (data) => {
    setLoading(true);
    submitFollowupRequest({
      reference_number: data.reference_number,
      setLoading,
      reset,
    });
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 max-w-md mx-auto py-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-[#1E3161] roboto">
              FOLLOW UP REQUEST
            </h2>
            <p className="text-sm text-gray-600 roboto">
              Enter your reference number to follow up on your request.
            </p>
          </div>

          <div>
            <Label label={"Reference Number"} htmlFor={"reference_number"} />
            <Input
              id="reference_number"
              type="text"
              placeholder="e.g. REF123456"
              {...register("reference_number", {
                required: "Reference number is required",
              })}
              className={`roboto ${errors.reference_number ? "border-red-500" : ""}`}
            />
            {errors.reference_number && (
              <span className="text-red-800 text-sm font-semibold roboto mt-1">
                {errors.reference_number.message}
              </span>
            )}
          </div>

          {loading ? (
            <div className="bg-[#1E3161] text-white py-2 rounded-r-4xl rounded-bl-4xl flex items-center justify-center w-full">
              <MoonLoader size={20} color="white" />
            </div>
          ) : (
            <button
              type="submit"
              className="bg-[#1E3161] w-full text-white py-2 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950 font-bold roboto mt-2"
            >
              SUBMIT
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FollowUpRequest;
