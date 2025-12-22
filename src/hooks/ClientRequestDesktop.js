import axios from "@/lib/axios";
import useSWR from "swr";
import Swal from "sweetalert2";
import { toast } from "sonner";
import ClientErrorLogForm from "@/app/request-loa/ClientErrorLogForm";


export const ClientRequestDesktop = () => {

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const searcHospital = async({ search, accepteloa, setHospital, setHosploading }) => {
        await csrf()

        axios.get(`/api/client-search-hospital`, {
            params: {
                search,
                accepteloa
            }
        })
        .then((res) => {
            
            if(res.data.length === 0){
                toast("Hospital/Clinic not found", {
                    description: "System cannot find the parameters you want to search"
                })
                setHospital('')
            } else {
                setHospital(res.data)
            }


        })
        .catch((error) => {
            if (error?.response?.status !== 422) throw error
            alert(error?.response?.data?.message)
        })
        .finally(() => {
            setHosploading(false)
        })
    }

    const searchDoctor = async({ id, search, setDoctor, setDocloading }) => {
        await csrf()

        axios.get('/api/client-search-doctor', {
            params: {
                hospitalid: id,
                search: search || ''
            }
        })
        .then((res) => {
            if(res.data.length === 0){
                toast("No Doctor Found", {
                    description: "System cannot find the parameters you want to search"
                })
                setDoctor('')
            } else {
                setDoctor(res.data)
            }
        })
        .catch(error => {
            if (error?.response?.status !== 422) throw error
            alert(error?.response?.data?.message)
        })
        .finally(() => {
            setDocloading(false)
        })
    }

    const submitRequestConsultation = async({setLoading, reset, setSelectedHospital, setSelectedDoctor, setErrorLogs, setShowErrorLogsModal, ...props}) => {
        await csrf()

        axios.post('/api/submit-request-consultation', props)
        .then((res) => {
            if(res.status == 201){
                if(res.data.isAuto == false){
                    Swal.fire({
                            title: "Successful Request for LOA",
                            text: `Your request has been submitted, your reference is ${res.data?.refno}. We will notify you through the email and mobile number you provided`,
                            icon: "success"
                    })
                }else{
                    Swal.fire({
                            title: "Successful Request for LOA",
                            text: `Your request has been successfully approved, we already send you the loa in your email`,
                            icon: "success"
                    })
                }
                reset()
                setSelectedDoctor()
                setSelectedHospital()
            }
            // console.log(res)
        })
        .catch((err) => {
            if(err.status == 404 && err.response.data.message == "Cannot find the patient"){
                Swal.fire({
                    title: "Validation Error",
                    text: `We are unable to validate your information. Please check your input and try again.`,
                    icon: "error",
                    showDenyButton: true,
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonText: "Report",
                    denyButtonText: "Close"
                }).then((res) => {
                    if(res.isConfirmed){
                        setErrorLogs(err.response.data.error_data)
                        setShowErrorLogsModal(true)
                    }else{
                        setErrorLogs(null)
                        setShowErrorLogsModal(false)
                    }
                })
            }else{
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

    const submitRequestLaboratory = async ({ formData, setLoading, reset, setSelectedHospital, setErrorLogs, setShowErrorLogsModal}) => {

        await csrf()
        axios.post('/api/submit-request-laboratory', formData, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })
        .then((res) => {
            if(res.status == 201){
                Swal.fire({
                    title: "Successful Request for LOA",
                    text: `Your request has been submitted, your reference is ${res.data?.refno}. We will notify you through the email and mobile number you provided`,
                    icon: "success"
                })
                reset()
                setSelectedHospital()
            }
        })
        .catch((err) => {
           if(err.status == 404 && err.response.data.message == "Cannot find the patient"){
                Swal.fire({
                    title: "Validation Error",
                    text: `We are unable to validate your information. Please check your input and try again.`,
                    icon: "error",
                    showDenyButton: true,
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonText: "Report",
                    denyButtonText: "Close"
                }).then((res) => {
                    if(res.isConfirmed){
                        setErrorLogs(err.response.data.error_data)
                        setShowErrorLogsModal(true)
                    }else{
                        setErrorLogs(null)
                        setShowErrorLogsModal(false)
                    }
                })
            }else{
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

    const searchComplaints = async({setLoadingComplaints, setComplaints, ...props}) => {

        await csrf()

        axios.get('/api/search-complaint', {
            params: {
                complaint: props.complaint
            }
        })
        .then((res) => {
            setComplaints(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoadingComplaints(false)
        })
    }

    const SubmitErrorLogs = async({onClose, ...props}) => {
        await csrf()

        axios.post('/api/error-logs', props)
            .then((res) => {
                if(res.status == 204){
                    Swal.fire({
                        title: "Success",
                        text: "Please allow 4 - 8 hours to validate your membership information. Meanwhile you may contact our 24/7 Client Care Hotline for urgent assistance.",
                        icon: "success",
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonText: "OK"
                    }).then((res) => {
                        if(res.isConfirmed){
                            onClose()
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        searcHospital,
        searchDoctor,
        submitRequestConsultation,
        submitRequestLaboratory,
        searchComplaints,
        SubmitErrorLogs
    }



}