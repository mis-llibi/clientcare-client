import Axios  from "axios";

const isProd = process.env.NODE_ENV === 'production'

const axios = Axios.create({
    baseURL: isProd ? process.env.NEXT_PUBLIC_DEPLOYED_BACKEND_API : process.env.NEXT_PUBLIC_BACKEND_API,
    headers: {
        'X-Requested-With' : 'XMLHttpRequest'
    },
    withCredentials: true,
    withXSRFToken: true
})

export default axios