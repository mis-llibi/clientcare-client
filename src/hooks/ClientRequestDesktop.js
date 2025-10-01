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

    return {
        searcHospital,
        searchDoctor
    }



}