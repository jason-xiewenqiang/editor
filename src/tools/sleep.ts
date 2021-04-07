
export default {}
export const sleep1 = (time: number) => new Promise(resolve => {
    setTimeout(resolve, time)
})
export const  sleepGenerator = function*(time: number) {
    yield new Promise(function(resolve) {
        setTimeout(resolve, time)
    })
}
const sleepAW = function (time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}
export const output = async (time: number) => {
    let out = await sleepAW(time)
    return out
} 
export const sleepES5 = function (callback: Function, time:number) {
    setTimeout(callback, time)
}
