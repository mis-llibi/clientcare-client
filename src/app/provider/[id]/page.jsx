'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from "next/navigation";
import Link from 'next/link';

// Hooks
import { useClientRequest } from "@/hooks/useClientRequest";

// Helpers
import { applink } from '@/lib/applink';

// Components
import Loading from '@/components/Loading';
import Error from './[loa_type]/Error';
import CardComponent from '@/components/ClientCare/Card';
import TermsOfUse from '@/components/TermsOfUse';


function Home() {
  const [provider, setProvider] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const { getProvider } = useClientRequest()
  const params = useParams()
  const { id } = params;

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      getProvider({
        id: id,
        setIsError,
        setIsLoading,
        setProvider
      })
    }

    // trigger terms popup on mount
    setShowTerms(true)
  }, [id])

  if (isLoading) return <Loading />
  if (isError) return <Error message={"We cannot find the provider, please go back"} />

  return (
    <>
      {showTerms && (
        <TermsOfUse onAccept={() => setShowTerms(false)} />
      )}

      {!showTerms && (
        <CardComponent>
          <h1 className="text-center text-[#1E3161] font-bold roboto mb-2">
            {provider?.provider}
          </h1>
          <div className='flex flex-col gap-2'>
            <h1 className='text-center text-[#1E3161] font-bold roboto'>
              Please choose your LOA type
            </h1>
            <div className='flex items-center justify-center gap-4'>
              <Link
                href={`${applink}/provider/${id}/consultation`}
                className='px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90'
              >
                Consultation
              </Link>
              <Link
                href={`${applink}/provider/${id}/laboratory`}
                className='px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 '
              >
                Laboratory
              </Link>
            </div>
          </div>
        </CardComponent>
      )}
    </>
  )
}

export default Home
