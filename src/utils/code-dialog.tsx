import { CodeEditor } from "@/components/code-editor";
import { Dialog } from "@/components/dialog";
import { isFunction } from ".";

export interface CodeDialogOptions {
    /** 弹窗标题 */
    title?: string;

    /** 代码语言 */
    language?: string;

    /** 代码内容 */
    code: string;

    /** 编辑确认 */
    onConfirm?: (code: string) => void;
}

const EDIT_DEFAULT_OPTIONS = {
    title: '编辑代码',
    language: 'javascript'
}


/**
 * 编辑代码
 * @param options 
 */
export const editCode = (options: CodeDialogOptions) => {

    const { title, code, language, onConfirm } = { ...EDIT_DEFAULT_OPTIONS, ...options };

    const dlg = Dialog({
        title,
        data: { code },
        render(data) {
            return <div style="height:500px;">
                <CodeEditor v-model={data.code} options={{ language }}></CodeEditor>
            </div>
        },
        async onConfirm(data) {
            if (isFunction(onConfirm)) {
                await onConfirm!(data.code);
            }

            dlg.hide();
        },
    });

    return dlg;
}


const VIEW_DEFAULT_OPTIONS = {
    title: '查看代码',
    language: 'javascript'
}

/**
 * 查看代码
 * @param options 
 */
export const viewCode = (options: CodeDialogOptions) => {
    const { title, code, language } = { ...options, ...VIEW_DEFAULT_OPTIONS };

    return Dialog({
        title,
        render() {
            return <div style="height:500px;">
                <CodeEditor modelValue={code} options={{ language, readOnly: true }}></CodeEditor>
            </div>
        },
        btns: false,
    })
}