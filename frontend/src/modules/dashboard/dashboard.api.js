import api from "../../app/axios";

export const fetchDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data.data;
};
