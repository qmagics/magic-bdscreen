
/** 延迟 */
export const sleep = (wait: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, wait);
    });
}

/** 深拷贝 */
export const deepClone = (obj: any, hashMap = new WeakMap) => {
    // 排除null和undefined
    if (obj == null || typeof obj !== 'object') return obj;

    // 排除非真正意义的对象
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);

    // 如果拷贝过，就直接返回（处理循环引用）
    if (hashMap.has(obj)) return hashMap.get(obj);

    // 剩下对象和数组
    const cloneObj = new obj.constructor();

    // 添加缓存
    hashMap.set(obj, cloneObj);

    // 循环递归拷贝属性
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], hashMap);
        }
    }

    return cloneObj;
}

/** 生成一个类型判断函数 */
const isType = (type: string) => (x: any) => Object.prototype.toString.call(x).slice(8, -1) === type;

/** 是否是数字 */
export const isNumber = isType('Number');

/** 是否是函数 */
export const isFunction = isType('Function');

/** 是否是数组 */
export const isArray = Array.isArray;

/** 将变量转化为有效的css属性值 */
export const parseCssValue = (v: string | number | undefined | null) => {
    if (isNumber(v)) return v + 'px';
    return v || '';
}

/** 值有变更 */
export const hasChanged = (v1: unknown, v2: unknown) => {
    return v1 !== v2;
}

export const serializeJSON = (v: any): string => {
    return JSON.stringify(v, null, 2);
}

export const parseJSON = <T = any>(v: string): T => {
    let res: any = null;
    try {
        res = JSON.parse(v);
    } catch (error) {
    }
    return res;
}