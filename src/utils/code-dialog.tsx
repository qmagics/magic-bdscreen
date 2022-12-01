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

    /** 描述 */
    description?: string;

    /** 只读 */
    readOnly?: boolean;
}

const DEFAULT_OPTIONS = {
    title: '代码内容',
    language: 'javascript'
}

/**
 * 创建代码弹窗
 * @param options 
 */
export const createCodeDialog = (options: CodeDialogOptions) => {
    const { title, code, language, onConfirm, readOnly } = { ...DEFAULT_OPTIONS, ...options };

    const dlg = Dialog({
        title,
        data: { code },
        render(data) {
            return <div class="code-dialog">
                <div class="code-dialog__header">
                    {options.description && <CodeEditor modelValue={options.description} height={100} options={{ language: 'typescript', readOnly: true }}></CodeEditor>}
                </div>
                <div class="code-dialog__body">
                    <CodeEditor v-model={data.code} options={{ language, readOnly }} height="100%"></CodeEditor>
                </div>
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

/**
 * 编辑代码
 * @param options 
 */
export const editCode = (options: CodeDialogOptions) => {
    return createCodeDialog({ ...options, title: '编辑代码' });
}

/**
 * 查看代码
 * @param options 
 */
export const viewCode = (options: CodeDialogOptions) => {
    return createCodeDialog({ ...options, title: '查看代码', readOnly: true });
}