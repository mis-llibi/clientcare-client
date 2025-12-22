import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {motion, AnimatePresence} from "motion/react"

import { ClientRequestDesktop } from "@/hooks/ClientRequestDesktop";

export default function ClientErrorLogForm({
  errorData,
  onClose,
}) {

    const { SubmitErrorLogs } = ClientRequestDesktop()
    const [loading, setLoading] = useState(false)



    
    // lock body scroll while modal is open
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = original;
        };
    }, [open]);

    const defaultValues = useMemo(
        () => ({
        principalFullName: errorData?.principalFullName || "",
        dependentFullName: errorData?.dependentFullName || "",
        company: errorData?.company || "",
        email: errorData?.email || "",
        mobile: errorData?.mobile || "",
        }),
        [errorData]
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ defaultValues });

    useEffect(() => {
        if (open) reset(defaultValues);
    }, [defaultValues, reset, open]);

    const submit = async (data) => {
        await SubmitErrorLogs({
            ...data,
            ...errorData,
            onClose,
        })
    };

    const overlay = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const panel = {
        hidden: { opacity: 0, y: 18, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
    };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
          >
            {/* Header */}
            <div className="px-5 py-4 sm:px-6 flex items-start justify-between border-b">
              <div>
                <h2 className="text-[#1E3161] font-bold roboto text-lg">
                  Report Validation Issue
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 roboto">
                  Please provide the details below so we can investigate and assist you.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="shrink-0 rounded-xl p-2 text-gray-500 hover:bg-gray-100 active:scale-95 transition disabled:opacity-60"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(submit)} className="px-5 py-5 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Principal */}
                <div>
                  <label className="text-[#1E3161] font-semibold roboto mb-1">
                    Principal Member Full Name <span className="text-red-700">*</span>
                  </label>
                  <input
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E3161]/30 focus:border-[#1E3161]  outline-[#1E3161] roboto ${
                      errors.principalFullName ? "border-red-400" : "border-black/30"
                    }`}
                    placeholder="e.g. Juan Dela Cruz"
                    {...register("principalFullName", {
                      required: "Principal member full name is required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                  />
                  {errors.principalFullName && (
                    <p className="mt-1 text-xs text-red-600 roboto">
                      {errors.principalFullName.message}
                    </p>
                  )}
                </div>

                {/* Dependent */}
                <div>
                  <label className="text-[#1E3161] font-semibold roboto mb-1">
                    Dependent Member Full Name
                  </label>
                  <input
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E3161]/30 focus:border-[#1E3161] outline-[#1E3161] roboto ${
                      errors.dependentFullName ? "border-red-400" : "border-black/30"
                    }`}
                    placeholder="e.g. Maria Dela Cruz"
                    {...register("dependentFullName", {
                      minLength: { value: 2, message: "Too short" },
                    })}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-[#1E3161] font-semibold roboto mb-1">
                    Company <span className="text-red-700">*</span>
                  </label>
                  <input
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E3161]/30 focus:border-[#1E3161] outline-[#1E3161] roboto ${
                      errors.company ? "border-red-400" : "border-black/30"
                    }`}
                    placeholder="e.g. ABC Corporation"
                    {...register("company", { required: "Company is required" })}
                  />
                  {errors.company && (
                    <p className="mt-1 text-xs text-red-600 roboto">{errors.company.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-[#1E3161] font-semibold roboto mb-1">
                    Email <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E3161]/30 focus:border-[#1E3161] outline-[#1E3161] roboto ${
                      errors.email ? "border-red-400" : "border-black/30"
                    }`}
                    placeholder="e.g. name@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 roboto">{errors.email.message}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="sm:col-span-2">
                  <label className="text-[#1E3161] font-semibold roboto mb-1">
                    Mobile <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E3161]/30 focus:border-[#1E3161] outline-[#1E3161] roboto ${
                      errors.mobile ? "border-red-400" : "border-black/30"
                    }`}
                    placeholder="e.g. 09xxxxxxxxx"
                    {...register("mobile", {
                      validate: (v) => {
                        if (!v) return true;
                        const digits = String(v).replace(/\D/g, "");
                        if (digits.length < 10) return "Mobile number seems too short";
                        return true;
                      },
                    })}
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-xs text-red-600 roboto">{errors.mobile.message}</p>
                  )}
                </div>
              </div>
              
              <h1 className="font-bold text-black/90 roboto text-center my-2">Lacson may reach out to your company to validate and effect changes in your information.</h1>

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.99] transition disabled:opacity-60"
                >
                  Cancel
                </button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  className="w-full sm:w-auto rounded-xl bg-[#1E3161] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16264b] transition disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
