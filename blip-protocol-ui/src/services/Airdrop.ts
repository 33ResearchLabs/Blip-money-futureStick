import { api } from "./api"

export const airdropApi = {
    postAirdrop: async (data) => {
        const res = await api.post('/airdrop/login', data)
        return res.data
    }
}