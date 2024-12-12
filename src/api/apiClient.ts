import axios from "axios";

const apiClient = axios.create({
    baseURL: `http://${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    withCredentials: true,

});

export default apiClient;