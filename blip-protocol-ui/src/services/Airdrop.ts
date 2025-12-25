import { api } from "./api"

export const airdropApi = {
    postAirdrop: async (data) => {
        const res = await api.post('/user/login', data)
        return res.data
    }
}