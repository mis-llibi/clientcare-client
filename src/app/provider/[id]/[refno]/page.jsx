'use client'
import React, { useEffect, useState } from 'react'
import { useClientRequest } from '@/hooks/useClientRequest'

import { useParams } from 'next/navigation'

import Loading from '@/components/Loading'
import ProviderUpdateRequest from './ProviderUpdateRequest'


function Page() {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [getData, setGetData] = useState(null)
    const [getDoctors, setGetDoctors] = useState([])


    const params = useParams()

    const { id, refno } = params

    const { checkRefNo } = useClientRequest()

    useEffect(() => {
        setIsLoading(true)
        checkRefNo({
            id: id,
            refno: refno,
            setIsLoading,
            setIsError,
            setIsSubmitted,
            setGetData,
            setGetDoctors
        })
    }, [id, refno])

  if (isLoading) return <Loading />;
  if (isError) return <div>We cannot find you in our database, please go back to the member's form.</div>
  if (isSubmitted) return <div>Your request has been submitted, your reference # is 1758709879. We will notify you through the email and mobile number you provided.</div>

  return <ProviderUpdateRequest patient={getData} doctors={getDoctors} />
}

export default Page
