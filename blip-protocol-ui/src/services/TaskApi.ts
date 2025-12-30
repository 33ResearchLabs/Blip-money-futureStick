import { api } from "./api"

export const TaskApi = {
    postNewTask: async (data: { task_type: string, proof_data: string }) => {
        const res = await api.post('/tasks', data);
        return res.data;
    },
    getAllTasks: async () => {
        const res = await api.get('/tasks');
        return res.data;
    },
}