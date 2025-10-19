import axios from 'axios';
const api = axios.create({
    baseURL : "http://localhost:5000",
    timeout : 2000,
    withCredentials : true
});

export const checkAuth = async () => {
    try {
        const req = await api.get('/api/v1/auth/check', {
            withCredentials : true
        });
        return req.data;
    } catch (error) {
        console.log(error);
    }
}

export const userLogin = async (payload) => {
    try {
        const req = await api.post('/api/v1/auth/login', payload, {
            withCredentials : true
        });
        return req.data;
    } catch (error) {
        console.log(error);
    }
}


export const registerUser = async (payload) => {
    try {
        const req = await api.post('/api/v1/auth/register', payload, {
            withCredentials : true
        });
        return req.data;
    } catch (error) {
        console.log(error);
    }
}