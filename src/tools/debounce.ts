// 防抖 在事件被触发时 过了n秒后再被执行 如果在这n秒内又触发 则重新计时
function debounce(fn: Function, wait: number, immediate: boolean) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    timeout && clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      callNow && fn.apply(context, arguments)
    } else {
      timeout = setTimeout(function () {
        fn.apply(context, args)
      }, wait)
    }
  }
}
export default debounce
