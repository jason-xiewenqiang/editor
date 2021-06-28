// 节流 规定单位时间内，只能触发一次函数 如果这个单位时间内触发多次函数 只执行一次
function throttle(fn, wait) {
  let ctx
  let args
  let previous = Date.now()
  return function () {
    let now = Date.now()
    ctx = this
    args = arguments
    if (now - previous >= wait) {
      fn.apply(ctx, args)
      previous = Date.now()
    }
  }
}

function throttle1(fn, wait) {
  let timeout
  return function () {
    const ctx = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null
        fn.apply(ctx, args)
      }, wait)
    }
  }
}

export default throttle
