import axios from "@/lib/axios";
import useSWR from "swr";
import Swal from "sweetalert2";
import { toast } from "sonner";


export const UseCsvUploader = () => {

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const csvUpload = async({ setMessage, file }) => {
        await csrf()
        console.log(file)
        const formData = new FormData()
        formData.append('file', file)

        axios.post('/api/csv/import', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .then((res) => {
            if (res.status === 200) {
                setMessage(`Success — inserted: ${res.data.inserted}`)
            }
        })
        .catch((err) => {
            setMessage('Upload failed: ' + err.message)
        })
    }

    return {
        csvUpload,
    }
}
