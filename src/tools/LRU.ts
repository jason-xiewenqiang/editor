        /************************************************************
        *                                                           *
        *  .=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.       *
        *   |                     ______                     |      *
        *   |                  .-"      "-.                  |      *
        *   |                 /            \                 |      *
        *   |     _          |              |          _     |      *
        *   |    ( \         |,  .-.  .-.  ,|         / )    |      *
        *   |     > "=._     | )(__/  \__)( |     _.=" <     |      *
        *   |    (_/"=._"=._ |/     /\     \| _.="_.="\_)    |      *
        *   |           "=._"(_     ^^     _)"_.="           |      *
        *   |               "=\__|IIIIII|__/="               |      *
        *   |              _.="| \IIIIII/ |"=._              |      *
        *   |    _     _.="_.="\          /"=._"=._     _    |      *
        *   |   ( \_.="_.="     `--------`     "=._"=._/ )   |      *
        *   |    > _.="                            "=._ <    |      *
        *   |   (_/                                    \_)   |      *
        *   |                                                |      *
        *   '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-='      *
        *                                                           *
        *                     年终还不发，你怕不怕                    *               
        *************************************************************/

// LUR 缓存淘汰机制 keep-alive 的实现
interface Cache {
    [key: string]: Object|String|Number
}
export default class LRUCache {
    protected keys: Array<string> = []
    protected cache: Cache = Object.create(null)
    protected capacity: number
    constructor(capacity: number) {
        this.capacity = capacity
    }
    get(key: string) {
        if (this.cache[key]) {
            this.remove(this.keys, key)
            this.keys.push(key)
            return this.cache[key]
        }
    }
    put(key: string, value: object) {
        if (this.cache[key]) {
            this.cache[key] = value
            this.remove(this.keys, key)
            this.keys.push(key)
        } else {
            this.keys.push(key)
            this.cache[key] = value
            if (this.keys.length > this.capacity) {
                this.removeCache(this.cache, this.keys, key)
            }
        }
    }
    remove(arr: Array<string>, key: string) {
        if (arr.length) {
            const index = arr.indexOf(key)
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
     }
    removeCache(cache: any, keys: Array<string>, key: string) {
        cache[key] = null
        this.remove(keys, key)
    }
} 

export class LRUCacheMap {
    protected capacity: number
    protected cache: Map<string, Object>
    constructor(capacity: number) {
        this.capacity = capacity
        this.cache = new Map()
    }
    get(key: string) {
        if (this.cache.has(key)) {
            let obj = this.cache.get(key)
            this.cache.delete(key)
            this.cache.set(key, obj as object)
            return obj
        }
        return -1
    }
    put(key: string, value:Object) {
        if ( this.cache.has(key)) {
            this.cache.delete(key)
        } else if (this.cache.size > this.capacity) {
            this.cache.delete(this.cache.keys().next().value)
        }
        this.cache.set(key, value)
    }
}