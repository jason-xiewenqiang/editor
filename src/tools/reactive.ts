let effective
function effect(fn: Function) {
    effective = fn
}
function reactive(data: object) {
    Object.keys(data).forEach(key=> {
        let val = data[key]
        Object.defineProperty(data, key, {
            enumerable: false,
            configurable: true,
            get: () => {
                return val
            },
            set: (newVal) => {
                if (val !== newVal) {
                    val = newVal
                }
            }
        })
    })
    return data 
}

export default {
    effect, reactive
}

const oldArrayPrototype = Array.prototype
const proto = Object.create(oldArrayPrototype)

['push', 'shift', 'pop', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
    proto[method] = function() {
        effect()
        oldArrayPrototype[method].call(this, ...arguments)
    }
});
if (Array.isArray(data)) {
    DataCue.__proto__ = proto
}

// proxy 
function proxyReactive (data: object) {
    const observe = new Proxy(data, {
        get: (target, key, receiver) => {
            let result = Reflect.get(target, key, receiver)
            return typeof result !== 'object' ? result : proxyReactive(result)
        },
        set: (target, key, value, receiver) => {
            effect()
            const ret = Reflect.set(target, key, value, receiver)
            return ret
        },
        deleteProperty: (target, key) => {
            const ret = Reflect.deleteProperty(target, key)
            return ret
        }
    })
    return observe
}