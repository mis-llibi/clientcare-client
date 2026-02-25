'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";
import ProviderClientRequest from "./ProviderClientRequest";
import { useClientRequest } from "@/hooks/useClientRequest";
import Error from "./Error";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helpers
import { applink } from "@/lib/applink";

function Page() {
  const [provider, setProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showTerms, setShowTerms] = useState(true);

  const { getProvider } = useClientRequest();
  const params = useParams();
  const { id: provider_id, loa_type } = params;

  useEffect(() => {
    if (provider_id) {
      setIsLoading(true);
      getProvider({
        id: provider_id,
        setIsError,
        setIsLoading,
        setProvider,
      });
    }
  }, [provider_id]);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Error message={"We cannot find the provider, please go back"} />
    );
  if (loa_type != "consultation" && loa_type != "laboratory")
    return <div>Error</div>;

  return (
    <>
      {/* Terms of Use popup for laboratory */}
      {loa_type === "laboratory" && showTerms && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-[#1E3161] font-bold roboto">
                Ask patient
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-700 text-center roboto">
                Please have the picture of your Laboratory request ready for uploading.
              </p>
            </CardContent>

            <CardFooter className="flex justify-center gap-4">
              <Button
                className="bg-[#1E3161] text-white hover:opacity-90 roboto"
                onClick={() => setShowTerms(false)} // proceed
              >
                Yes, Proceed
              </Button>
              <Link
                href={`${applink}/provider/${provider_id}`}
                className="px-4 py-2 rounded-lg  hover:bg-gray-100 text-sm roboto"
              >
                No
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Show main content when consultation OR laboratory after accepting */}
      {loa_type === "consultation" || (loa_type === "laboratory" && !showTerms) ? (
        <ProviderClientRequest provider={provider} loa_type={loa_type} hashed_id={provider_id} />
      ) : null}
    </>
  );
}

export default Page;
