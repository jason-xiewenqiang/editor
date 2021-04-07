
/*
                    _ooOoo_
                    o8888888o
                    88" . "88
                    (| -_- |)
                    O\  =  /O
                ____/`---'\____
                .'  \\|     |//  `.
            /  \\|||  :  |||//  \
            /  _||||| -:- |||||-  \
            |   | \\\  -  /// |   |
            | \_|  ''\---/''  |   |
            \  .-\__  `-`  ___/-. /
            ___`. .'  /--.--\  `. . __
        ."" '<  `.___\_<|>_/___.'  >'"".
        | | :  `- \`.;`\ _ /`;.`/ - ` : | |
        \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                    `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            佛祖保佑       永无BUG
*/
export default function create (obj: Object) {
    function F () {}
    F.prototype = obj
    return obj
}
export function myCreate (prototype, properties) {
    if (typeof prototype !== 'object') {
        throw TypeError()
    }
    function O() {}
    O.prototype = prototype
    var o = new O()
    if (prototype) {
        o.constructor = O
    }
    if (properties !== undefined) {
        if (properties !== Object(properties)) {
            throw TypeError()
        }
        Object.defineProperties(o, properties)
    }
    return o
}