import axios, { AxiosInstance } from "axios";
const {REACT_APP_API_URL, REACT_APP_BASE_PATH} = process.env;

export const axiosInstance: AxiosInstance = axios.create({ 
    baseURL: `${REACT_APP_API_URL}${REACT_APP_BASE_PATH}`,
    withCredentials: true
});