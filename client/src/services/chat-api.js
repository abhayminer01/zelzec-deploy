import axios from 'axios';
const api = axios.create({
    baseURL : `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`,
    timeout : 5000,
    withCredentials : true
});

export const startChat = async (sellerId, productId) => {
    try {
        const req = await api.post('/start', { seller : sellerId, product : productId });
        return req.data;
    } catch (error) {
        console.log(error);
    }
}

export const sendMessage = async (chatId, text) => {
    const req = await api.post("/send", {
        chatId,
        text
    });
    return req.data.message;
};
