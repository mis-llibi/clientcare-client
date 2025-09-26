'use client'
import React from 'react'
import axios from '@/lib/axios'
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';



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
                // console.log(err)
                if(err.status == 404){
                    Swal.fire({
                        title: "Error",
                        text: `${err.response.data.message}`,
                        icon: "error"
                    })
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const checkRefNo = async({setIsLoading, setIsError, setIsSubmitted, setGetData, setGetDoctors, setGetHospitalName, ...props} = {} ) => {
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
                setGetHospitalName(res.data.provider)
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

    const submitClientRequestConsultation = async({setLoading, setIsSubmitted, ...props}) => {
        await csrf()

        axios.post('/api/submit-update-request/consultation', props)
        .then((res) => {
            // console.log(res)
            if(res.status == 200){
                setIsSubmitted(true)
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const submitClientRequestLaboratory = async ({ formData, setLoading, setIsSubmitted }) => {

        await csrf()
        axios.post('/api/submit-update-request/laboratory', formData, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })
        .then((res) => {
            if(res.status == 200){
                setIsSubmitted(true)
            }
        })
        .catch((err) => {
            if(err.status == 422){
                Swal.fire({
                    title: "Error",
                    text: `${err.response.data.message}`,
                    icon: "error"
                })
            }
        })
        .finally(() => {
            setLoading(false);
        })

    };


  
  return {
    getProvider,
    submitClient,
    checkRefNo,
    submitClientRequestConsultation,
    submitClientRequestLaboratory
  }
}


