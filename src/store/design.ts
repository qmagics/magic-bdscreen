import { defineStore } from 'pinia';

const useDesignStore = defineStore('designStore', {
    state: () => {
        return {
            /** 物料库配置 */
            componentLib: {
                /** 选中的物料库 */
                activeCategory: "basic"
            },

            /**编辑器状态 */
            editorState: {
                /** 画布缩放 */
                scale: 1,

                /** 编辑器是否处于预览状态 */
                isPreview: false,

                /** 是否在画布中显示网格 */
                isShowGrid: false,

                /** 是否开启拖拽磁吸效果 */
                isMagnet: true,

                /** 是否显示参考线 */
                isShowMarkline: true
            }
        }
    },

    actions: {
        toggleIsPreview(value?: boolean) {
            this.editorState.isPreview = value ?? !this.editorState.isPreview;
        }
    }
})

export default useDesignStore;