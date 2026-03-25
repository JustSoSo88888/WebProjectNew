import api from './api';


/**
 * 系统播报
 * **/
export const awardLog = (params) => {
    return api.post('/system/awardLog ', params);
}