import apiClient from "@/api/apiClient";

export const login = async (id: string, password: string) => {
    const response = await apiClient.post("/auth/login",{
        id, password
    });

    console.log(response);

    return response;
}