import { apiClient } from "@/api/apiClients";
import Cookies from "js-cookie";

export const login = async (id: string, password: string) => {
    const response: { data: { code: number, access_token: string } } = await apiClient.post("/auth/login", {
        id, password
    });

    if (response.data.code === 200) {
        localStorage.setItem("accessToken", response.data.access_token);

        Cookies.set("accessToken", response.data.access_token, {
            path: "/",
            saneSite: "strict",
            secure: false,
        });
        return true;
    }
    else {
        return false;
    }
}

export const logout = async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("accessToken");
}

export const signup = async (id: string, name: string, password: string, role: string) => {
    const response = await apiClient.post("/auth/signup", {
        id, name, password, role
    });
    return response.data;
}