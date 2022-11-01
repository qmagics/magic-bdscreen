import useDesignStore from "@/store/design";
import { isNumber } from "@/utils";

const { editorState } = useDesignStore();

export const afterScale = (n: any) => {
    return isNumber(n) ? n * editorState.scale : n;
}

export const beforeScale = (n: any) => {
    return isNumber(n) ? n / editorState.scale : n;
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