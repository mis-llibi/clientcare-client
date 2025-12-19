'use client'
import React, { useEffect, useState } from 'react'
import { useClientRequest } from '@/hooks/useClientRequest'

import { useParams } from 'next/navigation'

import Loading from '@/components/Loading'
import Error from './Error'
import Submitted from './Submitted'
import Consultation from './Consultation'
import Laboratory from './Laboratory'


function Page() {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isAuto, setIsAuto] = useState(false)
    const [getData, setGetData] = useState(null)
    const [getDoctors, setGetDoctors] = useState([])
    const [getHospitalName, setGetHospitalName] = useState("")

    const params = useParams()


    const { id, refno, loa_type } = params


    const { checkRefNo } = useClientRequest()

    useEffect(() => {
        setIsLoading(true)
        checkRefNo({
            id: id,
            refno: refno,
            loa_type: loa_type,
            setIsLoading,
            setIsError,
            setIsSubmitted,
            setGetData,
            setGetDoctors,
            setGetHospitalName
        })
    }, [id, refno])

  if (isLoading) return <Loading />;
  if (isError) return <Error message={"We cannot find you in our database, please go back to the member's form."} />
  if (isSubmitted) return <Submitted 
                            message={`${isAuto ? "Your request has been approved" : `Your request has been submitted, your reference # is ${refno}. We will notify you and the hospital/clinic through email and mobile number you provided.`}`} 
                            provider_id={id}
                            loa_type={loa_type}
                            />

  return (
    <>
    {loa_type == "consultation" ? <Consultation 
                                    patient={getData} 
                                    doctors={getDoctors}
                                    provider={getHospitalName}
                                    refno={refno}
                                    setIsSubmitted={setIsSubmitted}
                                    provider_id={id}
                                    setIsAuto={setIsAuto}
                                    /> 
                                : <Laboratory 
                                    patient={getData}
                                    provider={getHospitalName}
                                    refno={refno}
                                    setIsSubmitted={setIsSubmitted}
                                    provider_id={id}
                                    />
                                }


    
    </>

  )
}

export default Page
