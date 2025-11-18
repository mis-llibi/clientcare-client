import axios from "@/lib/axios";
import useSWR from "swr";
import Swal from "sweetalert2";
import { toast } from "sonner";


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

    const submitRequestConsultation = async({setLoading, reset, setSelectedHospital, setSelectedDoctor, ...props}) => {
        await csrf()

        axios.post('/api/submit-request-consultation', props)
        .then((res) => {
            if(res.status == 201){
                Swal.fire({
                    title: "Successful Request for LOA",
                    text: `Your request has been submitted, your reference is ${res.data?.refno}. We will notify you through the email and mobile number you provided`,
                    icon: "success"
                })
                reset()
                setSelectedDoctor()
                setSelectedHospital()
            }
            // console.log(res)
        })
        .catch((err) => {
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

    const submitRequestLaboratory = async ({ formData, setLoading, reset, setSelectedHospital, }) => {

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
            if(err.status == 404){
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

    return {
        searcHospital,
        searchDoctor,
        submitRequestConsultation,
        submitRequestLaboratory,
        searchComplaints
    }



}