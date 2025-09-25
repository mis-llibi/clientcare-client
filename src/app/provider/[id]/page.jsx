'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import ProviderClientRequest from "./ProviderClientRequest";
import { useClientRequest } from "@/hooks/useClientRequest";
import Error from "./Error";

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
  if (isError) return <Error message={"We cannot find the provider, please go back"} />

  return <ProviderClientRequest provider={provider} />
}

export default Page
