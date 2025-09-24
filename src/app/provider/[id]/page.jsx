'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import ProviderClientRequest from "./ProviderClientRequest";
import { useClientRequest } from "@/hooks/useClientRequest";

function Page() {

    const [provider, setProvider] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const { getProvider } = useClientRequest()

    const params = useParams()
    const { id } = params;

    useEffect(() => {
        if(id){
            setIsLoading(true)
            getProvider({
                id: id,
                setIsError,
                setIsLoading,
                setProvider
            })
        }
    }, [id])

  if (isLoading) return <Loading />;
  if (isError) return <div>Error</div>

  return <ProviderClientRequest provider={provider} />
}

export default Page
