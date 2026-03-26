"use client";

import { useState } from "react";
import { useHrAuth } from "@/hooks/useHrAuth";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Link from "next/link";

export default function HrRegisterPage() {
  const { register } = useHrAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/hr",
  });

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);

  const submitForm = (e) => {
    e.preventDefault();
    register({
      first_name,
      last_name,
      email,
      password,
      password_confirmation,
      setErrors,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#1E3161] text-center mb-6">
          HR Portal Registration
        </h2>

        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <Label htmlFor="first_name" label="First Name" />
            <Input
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name" label="Last Name" />
            <Input
              id="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" label="Email" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" label="Password" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password_confirmation" label="Confirm Password" />
            <Input
              id="password_confirmation"
              type="password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3161] text-white py-2 rounded-lg hover:bg-[#162548] transition cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            href="/hr/login"
            className="text-[#1E3161] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
