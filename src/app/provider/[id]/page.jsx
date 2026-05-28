"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { useClientRequest } from "@/hooks/useClientRequest";
import { applink } from "@/lib/applink";

import Loading from "@/components/Loading";
import Error from "./[loa_type]/Error";
import CardComponent from "@/components/ClientCare/Card";
import TermsOfUse from "@/components/TermsOfUse";
import NotificationSystem from "@/components/NotificationSystem";
import FollowUpRequestForm from "./FollowUpRequestForm";
import Reimbursement from "./reimbursement/page";

function Home() {
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // one state controls the whole flow
  const [step, setStep] = useState("terms"); // 'terms' | 'notification' | 'main' | 'followup'

  const { getProvider } = useClientRequest();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    getProvider({
      id,
      setIsError,
      setIsLoading,
      setProvider,
    });

    // IMPORTANT:
    // Do NOT do setStep('terms') here, or it will reset the flow.
  }, [id]);

  if (isLoading) return <Loading />;
  if (isError)
    return <Error message="We cannot find the provider, please go back" />;

  return (
    <>
      {step === "terms" && (
        <TermsOfUse
          provider_id={id}
          device="mobile"
          onAccept={() => setStep("notification")}
        />
      )}

      {step === "notification" && (
        <NotificationSystem onAccept={() => setStep("main")} />
      )}

      {step === "main" && (
        <CardComponent>
          <h1 className="text-center text-[#1E3161] font-bold roboto mb-2">
            {provider?.provider}
          </h1>

          <div className="flex flex-col gap-2">
            <h1 className="text-center text-[#1E3161] font-bold roboto">
              Please choose your LOA type
            </h1>

            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-2 w-full">
              <Link
                href={`${applink}/provider/${id}/consultation`}
                className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 roboto w-full max-w-[250px] text-center"
              >
                Consultation
              </Link>

              <Link
                href={`${applink}/provider/${id}/laboratory`}
                className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 roboto w-full max-w-[250px] text-center"
              >
                Laboratory
              </Link>

              <button
                onClick={() => setStep("reimbursement")}
                className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 roboto w-full max-w-[250px] text-center"
              >
                Reimbursement
              </button>

              <button
                onClick={() => setStep("followup")}
                className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 roboto w-full max-w-[250px] text-center"
              >
                Follow Up Request
              </button>
            </div>
          </div>
        </CardComponent>
      )}

      {step === "followup" && (
        <CardComponent>
          <FollowUpRequestForm onBack={() => setStep("main")} />
        </CardComponent>
      )}

      {step === "reimbursement" && (
        <CardComponent>
          <Reimbursement onBack={() => setStep("main")} />
        </CardComponent>
      )}
    </>
  );
}

export default Home;
