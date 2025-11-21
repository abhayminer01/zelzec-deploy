import axios from 'axios';
const api = axios.create({
    baseURL : `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`,
    timeout : 5000,
    withCredentials : true
});

export const startChat = async (productId) => {
    try {
        const req = await api.post('/start', { productId : productId });
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
    
    return req.data.data;
};


export const getHistory = async (chatId) => {
    const res = await api.get('/history', { chatId : chatId });
    return {
        chats: res.data.chats,
        currentUserId: res.data.currentUserId
    };
};