import axios from "axios"
import {AuthResponse} from "../models/response/AuthResponse"
export const API_URL = "https://server-authorization.herokuapp.com/auth"


const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
},async(error)=>{
    const originalReqest =error.config
    if(error.response.satus === 401 && error.config && !error.config._isRetry){
        originalReqest._isRetry = true;
    }
    if(error.response.status === 401){
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials:true});
    localStorage.setItem('token',response.data.accessToken);
    return $api.request(originalReqest)
        } catch (error) {
            console.log("User is not Authorized!")
        }
    }
    throw error
})
export default $api;