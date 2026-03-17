import axios from 'axios';
import config from '~/config';

const requestUrl = config.debug ? config.mockUrl : config.baseUrl;
let instance = axios.create({
    baseURL: requestUrl,
    timeout: 30000,
    header: {
        'content-type': 'application/json;charset=UTF-8'
    }
})

instance.interceptors.request.use(function (config) {
    
})