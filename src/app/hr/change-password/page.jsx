'use client'

import Header from "@/components/Hr/Header";
import React, { useState } from "react";
import { useHrAuth } from "@/hooks/useHrAuth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const { user, changePassword, logout } = useHrAuth({ middleware: "auth" });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const submitChangePassword = (data) => {
    setLoading(true);

    changePassword({
      ...data,
      setLoading,
      reset
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 roboto">
      <div className="py-10">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg">
            <Header logout={logout} user={user} />
          </div>

          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Change Password</CardTitle>
              <CardDescription>
                Update your account password to keep your account secure.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(submitChangePassword)}>
                <div>
                  <label
                    htmlFor="current_password"
                    className="text-[#1E3161] font-semibold roboto"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto"
                    {...register("current_password", {
                      required: "Current Password is required",
                    })}
                  />
                  {errors?.current_password && (
                    <h1 className="text-red-800 text-sm font-semibold roboto mt-1">
                      {errors.current_password.message}
                    </h1>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="new_password"
                    className="text-[#1E3161] font-semibold roboto"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto"
                    {...register("new_password", {
                      required: "New Password is required",
                      minLength: {
                        value: 8,
                        message: "New Password must be at least 8 characters",
                      },
                    })}
                  />
                  {errors?.new_password && (
                    <h1 className="text-red-800 text-sm font-semibold roboto mt-1">
                      {errors.new_password.message}
                    </h1>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="text-[#1E3161] font-semibold roboto"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    className="border border-black/30 w-full py-2 px-3 rounded-lg outline-[#1E3161] roboto"
                    {...register("confirm_password", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("new_password") || "Passwords do not match",
                    })}
                  />
                  {errors?.confirm_password && (
                    <h1 className="text-red-800 text-sm font-semibold roboto mt-1">
                      {errors.confirm_password.message}
                    </h1>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link 
                    href={"/hr"}
                  >
                    Back
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}