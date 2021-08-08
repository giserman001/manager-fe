/**
 * 环境配置封装
 * 
 **/
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/25a034cd01ac814ef6083808922b13c9/api'
    },
    test: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/25a034cd01ac814ef6083808922b13c9/api'
    },
    prod: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/25a034cd01ac814ef6083808922b13c9/api'
    }
}
export default {
    namespace: 'manage',
    env,
    mock: true,
    ...EnvConfig[env]
}