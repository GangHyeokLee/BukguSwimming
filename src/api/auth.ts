import apiClient from "@/api/apiClient";

export const login = async (id: string, password: string) => {
    const response = await apiClient.post("/auth/login", {
        id, password
    });
    return response.data;
}

export const logout = async () => {
    const response = await apiClient.post("/auth/logout");
}

export const signup = async (id: string, name: string, password: string, role: string) => {
    const response = await apiClient.post("/auth/signup", {
        id, name, password, role
    });
    return response.data;
}