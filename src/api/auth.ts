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