function newer() {
    const obj = {}
    const fn = Array.prototype.slice.call(arguments)
    obj.__proto__ = fn.prototype
    const returnVal = fn.apply(obj, arguments)
    return typeof returnVal === 'object' ? returnVal : obj 
}