import axios from "axios";
import { Ifunctionary, IOffice, ISede, IUser } from "./interface";
import { getStorage } from "./functions";

export const API_BASE = "http://localhost:3000/api/v1";
export const API_UPLOAD = "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

export const user = getStorage();

export const API = {
    //SEDES
    getSedesFilter: async (page: number, limit: number) => {
        const response = await api.get(`/sedes/filter?page=${page}&limit=${limit}`);
        return response.data;
    },
    getSedes: async () => {
        const response = await api.get(`/sedes`);
        return response.data;
    },
    createSede: async (sede: ISede) => {
        const response = await api.post("/sedes", sede);
        return response.data;
    },
    updateSede: async (id: string, sede: ISede) => {
        const response = await api.put(`/sedes/${id}`, sede);
        return response.data;
    },
    deleteSede: async (id: string) => {
        const response = await api.delete(`/sedes/${id}`);
        return response.data;
    },
    //OFFICES
    getOfficesFilter: async (page: number, limit: number) => {
        const response = await api.get(`/offices/filter?page=${page}&limit=${limit}`);
        return response.data;
    },
    getOffices: async () => {
        const response = await api.get(`/offices`);
        return response.data;
    },
    createOffice: async (sede: IOffice) => {
        const response = await api.post("/offices", sede);
        return response.data;
    },
    updateOffice: async (id: string, sede: IOffice) => {
        const response = await api.put(`/offices/${id}`, sede);
        return response.data;
    },
    deleteOffice: async (id: string) => {
        const response = await api.delete(`/offices/${id}`);
        return response.data;
    },

    //USERS
    getUsersFilter: async (page: number, limit: number) => {
        const response = await api.get(`/users/filter?page=${page}&limit=${limit}`);
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get(`/users`);
        return response.data;
    },
    createUser: async (data: IUser) => {
        const response = await api.post("/users", data);
        return response.data;
    },
    updateUser: async (id: string, data: IUser) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
    loginUser: async (data: { user: string, password_hash: string }) => {
        const response = await api.post("/users/login", data);
        return response.data;
    },

    //ROLES
    getRoles: async () => {
        const response = await api.get(`/roles`);
        return response.data;
    },

    //FUNCTIONARY
    getFunctionariesFilter: async (page: number, limit: number) => {
        const response = await api.get(`/functionaries/filter/${user.office.id}?page=${page}&limit=${limit}`);
        return response.data;
    },
    getFunctionaries: async () => {
        const response = await api.get(`/functionaries?officeId=${user.office.id}`);
        return response.data;
    },
    createFunctionary: async (data: Ifunctionary) => {
        const response = await api.post("/functionaries", data);
        return response.data;
    },
    updateFunctionary: async (id: string, data: Ifunctionary) => {
        const response = await api.put(`/functionaries/${id}`, data);
        return response.data;
    },
    deleteFunctionary: async (id: string) => {
        const response = await api.delete(`/functionaries/${id}`);
        return response.data;
    },

    //VISIT
    getVisitsFilter: async (page: number, limit: number, id?: string) => {
        const response = await api.get(`/visits/filter/${id ? id : user.office.id}?page=${page}&limit=${limit}`);
        return response.data;
    },
    getVisitsFilterPending: async (page: number, limit: number) => {
        const response = await api.get(`/visits/filter/pending/${user.office.id}?page=${page}&limit=${limit}`);
        return response.data;
    },
    getVisits: async () => {
        const response = await api.get(`/visits`);
        return response.data;
    },
    createVisit: async (data: any) => {
        const response = await api.post("/visits", data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    updateVisit: async (id: string, data: any) => {
        const response = await api.put(`/visits/${id}`, data);
        return response.data;
    },

    updateVisitCheck: async (id: string, data: any) => {
        const response = await api.put(`/visits/check/${id}`, data);
        return response.data;
    },
    deleteVisit: async (id: string) => {
        const response = await api.delete(`/visits/${id}`);
        return response.data;
    },

    //DASHBOARD
    getDashBoard: async () => {
        const response = await api.get(`/dashboard/${user.office.id}`);
        return response.data;
    },
    getDashBoardDni: async (dni: string) => {
        const response = await api.get(`/dashboard/consulta?dni=${dni}`);
        return response.data;
    },
}