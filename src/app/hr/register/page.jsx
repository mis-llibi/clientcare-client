"use client";

import { useState, useEffect } from "react";
import { useHrAuth } from "@/hooks/useHrAuth";
import Input from "@/components/Input";
import Label from "@/components/Label";
import SelectComponent from "@/components/Select";
import useHrForm from "@/hooks/useHrForm";
import PhoneInputMask from "@/components/InputMask";
import { useRouter } from "next/navigation";



export default function HrRegisterPage() {


  const router = useRouter()
  const { register, user, isLoading } = useHrAuth({
    middleware: "auth",
  });

  useEffect(() => {
    if(user && !user?.is_admin){
      router.push('/hr')
    }
  }, [user])





  const { companies } = useHrForm();

  const [companyId, setCompanyId] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    if (!companyId) {
      setErrors({ company_name: ["Please select a company"] });
      return;
    }
    setLoading(true);

    let formatted_contact = contact_number;
    if (formatted_contact) {
      const digits = formatted_contact.replace(/\D/g, "");
      if (digits.startsWith("63")) {
        formatted_contact = "0" + digits.slice(2);
      } else if (!digits.startsWith("0")) {
        formatted_contact = "0" + digits;
      } else {
        formatted_contact = digits;
      }
    }

    const comp = companies.find((c) => String(c.value) === String(companyId));
    register({
      company_name: comp ? comp.name : "",
      comp_code: comp ? comp.comp_code : "",
      username,
      first_name,
      last_name,
      email,
      password,
      password_confirmation,
      contact_number: formatted_contact,
      setErrors,
      setLoading,
    });
  };

  if(isLoading){
    return(
      <>
      <div>
        Loading....
      </div>
      
      </>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#1E3161] text-center mb-6">
          HR Portal Registration
        </h2>

        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <Label htmlFor="company_name" label="Company Name" />
            <SelectComponent
              itemList={companies}
              className="w-full border border-black/30 py-1 px-2 rounded-lg outline-[#1E3161] bg-white text-left"
              value={companyId}
              onValueChange={setCompanyId}
              placeholder="Select Company"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company_name[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="username" label="Username" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="first_name" label="First Name" />
            <Input
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
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
            <Label htmlFor="contact_number" label="Contact Number" />
            <PhoneInputMask
              value={contact_number}
              onChange={setContactNumber}
              placeholder="+63 (___)-___-____"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact_number[0]}
              </p>
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
            disabled={loading}
            className="w-full bg-[#1E3161] text-white py-2 rounded-lg hover:bg-[#162548] transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {loading ? "" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
