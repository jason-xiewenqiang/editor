/* eslint-disable */
export const uuid = () => {
	const _lut = [];

	for (let i = 0; i < 256; i++) {
		_lut[i] = (i < 16 ? "0" : "") + i.toString(16);
	}

	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

	const d0 = (Math.random() * 0xffffffff) | 0;
	const d1 = (Math.random() * 0xffffffff) | 0;
	const d2 = (Math.random() * 0xffffffff) | 0;
	const d3 = (Math.random() * 0xffffffff) | 0;
	const uuid =
		_lut[d0 & 0xff] +
		_lut[(d0 >> 8) & 0xff] +
		_lut[(d0 >> 16) & 0xff] +
		_lut[(d0 >> 24) & 0xff] +
		"-" +
		_lut[d1 & 0xff] +
		_lut[(d1 >> 8) & 0xff] +
		"-" +
		_lut[((d1 >> 16) & 0x0f) | 0x40] +
		_lut[(d1 >> 24) & 0xff] +
		"-" +
		_lut[(d2 & 0x3f) | 0x80] +
		_lut[(d2 >> 8) & 0xff] +
		"-" +
		_lut[(d2 >> 16) & 0xff] +
		_lut[(d2 >> 24) & 0xff] +
		_lut[d3 & 0xff] +
		_lut[(d3 >> 8) & 0xff] +
		_lut[(d3 >> 16) & 0xff] +
		_lut[(d3 >> 24) & 0xff];

	// .toUpperCase() here flattens concatenated strings to save heap memory space.
	return uuid.toUpperCase();
};
// /**
//  * 深拷贝
//  * @param {any} obj 被拷贝的数据，不支持Map、WeakMap、Set、WeakSet
//  */
// export function deepClone(obj: object) {
//   let type = getObjectType(obj);
//   if (type === 'object') {
//     let res = {};
//     Object.keys(obj).forEach(key => {
//       res[key] = deepClone(obj[key]);
//     });
//     return res;
//   }
//   if (type === 'array') {
//     let res = [];
//     obj.forEach((item) => {
//       res.push(deepClone(item));
//     });
//     return res;
//   }
//   return obj;
// }

// /**
//  * 获取数据类型
//  *
//  * @param {Object} object
//  */
// export function getObjectType(obj: object) {
//   return obj === null ? 'null' : obj instanceof Array ? 'array' : typeof obj !== 'object' ? typeof obj : 'object';
// }

export default {  };
