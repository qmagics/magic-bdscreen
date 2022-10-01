import useDesignStore from "@/store/design";
import { isNumber } from "@/utils";

const { editorState } = useDesignStore();

export const afterScale = (n: any) => {
    return isNumber(n) ? n * editorState.scale : n;
}

export const beforeScale = (n: any) => {
    return isNumber(n) ? n / editorState.scale : n;
}