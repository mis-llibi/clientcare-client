'use client'
import React, { useEffect, useState } from 'react'
import { useClientRequest } from '@/hooks/useClientRequest'

import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

import Loading from '@/components/Loading'
import ProviderUpdateRequest from './ProviderUpdateRequest'
import Error from './Error'
import Submitted from './Submitted'


function Page() {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [getData, setGetData] = useState(null)
    const [getDoctors, setGetDoctors] = useState([])


    const params = useParams()
    const searchParams = useSearchParams()

    const { id, refno } = params
    const provider = searchParams.get('provider')
    // console.log(searchParams.get('provider'))

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
  if (isError) return <Error message={"We cannot find you in our database, please go back to the member's form."} />
  if (isSubmitted) return <Submitted 
                            message={`Your request has been submitted, your reference # is ${refno}. We will notify you and the hospital/clinic through email and mobile number you provided.`} 
                            provider_id={id}
                            />

  return <ProviderUpdateRequest 
            patient={getData} 
            doctors={getDoctors} 
            provider={provider} 
            refno={refno}
            setIsSubmitted={setIsSubmitted}
            />
}

export default Page
