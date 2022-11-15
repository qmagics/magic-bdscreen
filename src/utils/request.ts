import axios from 'axios';

const request = axios.create();

request.interceptors.response.use(res => {
    return res.data;
})

export default request;