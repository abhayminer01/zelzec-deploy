import axios from 'axios';
const api = axios.create({
    baseURL : "http://localhost:5000/api/v1/category",
    timeout : 2000,
    withCredentials : true
});

export const getPrimaryCategories = async () => {
    try {
        const req = await api.get('/primary');
        return req.data;
    } catch (error) {
        console.log(error);
    }
}

export const getCategoryForm = async (id) => {
    try {
        const req = await api.get(`/formdata/${id}`);
        return req.data;
    } catch (error) {
        console.log(error);
    }
}