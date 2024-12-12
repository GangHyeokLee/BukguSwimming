import apiClient from "@/api/apiClient";

export const login = async (id: string, password: string) => {
    const response = await apiClient.post("/login",{
        id, password
    });

    console.log(response);

    return response;
}