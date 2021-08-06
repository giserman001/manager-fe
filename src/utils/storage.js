/**
 * storage二次分装
*/
import config from '../config'
export default {
    setItem(key, val) {
        const storage = this.getStorage()
        // 往命名空间对象里塞数据
        storage[key] = val
        // 在存储到本地
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
    },
    getItem(key) {
        return this.getStorage()[key]
    },
    clearItem(key) {
        const storage = this.getStorage()
        delete storage[key]
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    clearAll() {
        window.localStorage.clear()
    }
}