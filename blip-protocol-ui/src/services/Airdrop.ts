import { api } from "./api"

export const airdropApi = {
    postAirdrop: async (data) => {
        // api.post already returns response.data due to interceptor (see api.ts line 27)
        const response = await api.post('/user/login', data)
        return response
    },

    logout: async () => {
        // api.post already returns response.data due to interceptor
        const response = await api.post('/user/logout')
        return response
    }
}