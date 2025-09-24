'use client'
import React from 'react'
import axios from '@/lib/axios'
import { useRouter } from "next/navigation";



export const useClientRequest = () => {

  const router = useRouter()
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const getProvider = async({setIsError, setIsLoading, setProvider, id}) => {
    await csrf()
    axios.get('/api/get-provider-id', {
      params: {
        id
      }
    })
    .then((res) => {
      setProvider(res.data.provider)
    })
    .catch((err) => {
        if(err.status == 422){
            setIsError(true)
        }
    })
    .finally(() => {
        setIsLoading(false)
    })



  }

  const submitClient = async({setLoading, ...props}) => {
        await csrf()
        
        axios.post('/api/submit-client-request', {
            ...props
        })
        .then((res) => {
            // console.log(res.data)
            router.push(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
  }

    const checkRefNo = async({setIsLoading, setIsError, setIsSubmitted, setGetData, setGetDoctors, ...props} ) => {
        await csrf()

        axios.get('/api/update-client-request', {
            params: {
                ...props
            }
        })
        .then((res) => {
            // console.log(res)
            if(res.data.isSubmitted){
                setIsSubmitted(true)
            }else{
                setGetData(res.data.data)
                setGetDoctors(res.data.doctors)
            }
        })
        .catch((err) => {
            // console.log(err)
            if(err.status == 404){
                setIsError(true)
            }
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

  
  return {
    getProvider,
    submitClient,
    checkRefNo
  }
}


