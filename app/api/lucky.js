import api from './api';
import config from '~/config/index.js';

const mockData = {
    config: {
        success: true,
        data: {
            chances: 5,
            prizes: [
                { name: 'R$10', icon: '💵', desc: 'Cash reward' },
                { name: 'R$50', icon: '💰', desc: 'Big cash reward' },
                { name: 'R$5', icon: '💴', desc: 'Small cash reward' },
                { name: 'R$100', icon: '💎', desc: 'Jackpot prize!' },
                { name: 'R$20', icon: '💵', desc: 'Medium cash reward' },
                { name: 'R$30', icon: '💸', desc: 'Great cash reward' }
            ]
        }
    },
    draw: {
        success: true,
        data: {
            prizeIndex: 0,
            prize: { name: 'R$10', icon: '💵', desc: 'Cash reward' }
        }
    },
    records: {
        success: true,
        data: {
            list: [
                { user: 'User123', time: '2024-01-15 14:30', prize: 'R$50' },
                { user: 'User456', time: '2024-01-15 14:25', prize: 'R$10' },
                { user: 'User789', time: '2024-01-15 14:20', prize: 'R$30' }
            ]
        }
    }
}

const mockRequest = (mockKey) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData[mockKey])
        }, 500)
    })
}

export const getLuckyConfig = (params) => {
    if (config.debug) {
        return mockRequest('config')
    }
    return api.post('/lucky/config', params);
}

export const doLuckyDraw = (params) => {
    if (config.debug) {
        const prizeCount = mockData.config.data.prizes.length
        const prizeIndex = Math.floor(Math.random() * prizeCount)
        const prize = mockData.config.data.prizes[prizeIndex]
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: { 
                        prizeIndex, 
                        prize,
                        remainingChances: 4
                    }
                })
            }, 300)
        })
    }
    return api.post('/lucky/draw', params);
}

export const getLuckyRecords = (params) => {
    if (config.debug) {
        return mockRequest('records')
    }
    return api.post('/lucky/records', params);
}
