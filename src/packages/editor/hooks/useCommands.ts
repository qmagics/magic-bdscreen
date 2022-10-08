import { MANAGER_KEY } from "@/packages/tokens";
import { BlockData, ConfigData, RegisterComponent } from "@/types";
import { deepClone } from "@/utils";
import { inject, onBeforeUnmount, reactive, WritableComputedRef } from "vue";
import events from "../events";
import { FocusData } from "./useFocus";

/** 指令 */
export interface Command {
    /** 指令名称 */
    name: string;

    /** 指令运行内容 */
    execute: (...args: any) => { redo: Function; queueName?: string;[key: string]: any; };

    /** 指令初始化执行方法 */
    init?: Function;

    /** 指令键盘快捷键 */
    keycodes?: string;

    /** 指令是否添加进操作队列（可实现撤销和重做） */
    pushQueue?: boolean;

    /** 在队列中显示的名称（用于展示历史操作） */
    queueName?: string;

    /** 自定义属性 */
    [key: string]: any;
}

/** 操作记录 */
export interface CommandAction {
    undo: Function;
    redo: Function;
    queueName?: string;
}

export interface UseCommandsState {
    current: number;
    queue: CommandAction[];
    commands: Record<string, Function>;
    commandArray: Command[];
    destroyArray: Function[];
}

export const useCommands = (configData: WritableComputedRef<ConfigData>, focusData: FocusData) => {

    const manager = inject(MANAGER_KEY)!;

    const state: UseCommandsState = reactive({
        current: -1,
        queue: [],
        commands: {},
        commandArray: [],
        destroyArray: []
    })

    /** 注册命令*/
    const register = (command: Command) => {
        state.commandArray.push(command);
        state.commands[command.name] = (...args: any) => {
            const { redo, undo, queueName } = command.execute(...args);
            redo();

            if (!command.pushQueue) return;

            let { queue, current } = state;

            // 处理中途有撤销的情况
            // 动作列表：操作1 => 操作2 => 操作3 => 撤销 => 撤销 => 操作4
            // 队列状态：操作1 => 操作4
            if (queue.length > 0) {
                queue = queue.slice(0, current + 1);
                state.queue = queue;
            }

            queue.push({ redo, undo, queueName: queueName || command.queueName });
            state.current = current + 1;
        }
    }

    // 根据索引重做队列中的某个操作
    register({
        name: "applyQueue",
        execute(index: number) {
            return {
                redo() {
                    if (index === -1) return;

                    const item = state.queue[index];

                    if (item) {
                        item.redo();
                        state.current = index;
                    }
                }
            }
        }
    });

    // 重做
    register({
        name: 'redo',
        keycodes: "ctrl+y",
        execute() {
            return {
                redo() {
                    const item = state.queue[state.current + 1];

                    if (item) {
                        item.redo();
                        state.current++;
                    }
                }
            }
        }
    });

    // 撤销
    register({
        name: 'undo',
        keycodes: 'ctrl+z',
        execute() {
            return {
                redo: () => {
                    if (state.current === -1) return;

                    const item = state.queue[state.current];

                    if (item) {
                        item.undo();
                        state.current--;
                    }
                }
            }
        }
    });

    // 拖拽添加（从物料库拖拽组件到画布中）
    register({
        name: "dragAdd",
        pushQueue: true,
        queueName: "添加",
        init() {
            this.before = null;

            const start = () => this.before = deepClone(configData.value.blocks);

            const end = (component: any) => state.commands.dragAdd(component);

            events.on('dragAddStart', start);
            events.on('dragAddEnd', end);

            return () => {
                events.off('dragAddStart', start);
                events.off('dragAddEnd', end);
            }
        },
        execute(component: RegisterComponent) {
            const before = this.before;
            const after = configData.value.blocks;
            return {
                queueName: `${this.queueName}<${component.name}>`,
                redo() {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo() {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 拖拽移动（对画布中区块的拖拽）
    register({
        name: "dragMove",
        pushQueue: true,
        queueName: "移动元素",
        init() {
            this.before = null;

            const start = () => this.before = deepClone(configData.value.blocks);

            const end = (component: any) => state.commands.dragMove(component);

            events.on('dragMoveStart', start);
            events.on('dragMoveEnd', end);

            return () => {
                events.off('dragMoveStart', start);
                events.off('dragMoveEnd', end);
            }
        },
        execute(block: BlockData) {
            const before = this.before;
            const after = configData.value.blocks;

            const component = manager.getComponentByType(block.type);

            return {
                queueName: `${this.queueName}<${component.name}>`,
                redo() {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo() {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 拖拽缩放（对画布中区块的拖拽缩放）
    register({
        name: "dragResize",
        pushQueue: true,
        queueName: "缩放元素",
        init() {
            this.before = null;

            const start = () => this.before = deepClone(configData.value.blocks);

            const end = (component: any) => state.commands.dragResize(component);

            events.on('dragResizeStart', start);
            events.on('dragResizeEnd', end);

            return () => {
                events.off('dragResizeStart', start);
                events.off('dragResizeEnd', end);
            }
        },
        execute(block: BlockData) {
            const before = this.before;
            const after = configData.value.blocks;

            const component = manager.getComponentByType(block.type);

            return {
                queueName: `${this.queueName}<${component.name}>`,
                redo() {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo() {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 更新全部配置数据
    register({
        name: "updateConfigData",
        pushQueue: true,
        queueName: "更新整个编辑器",
        execute(newConfigData) {
            const before = deepClone(configData.value);
            const after = newConfigData;
            return {
                redo: () => {
                    configData.value = after;
                },
                undo: () => {
                    configData.value = before;
                }
            }
        }
    });

    // 置顶
    register({
        name: "placeTop",
        pushQueue: true,
        queueName: "置顶",
        execute() {
            const before = deepClone(configData.value.blocks);

            const after = (() => {
                const { focused, unfocused } = focusData.value;

                const maxZIndex = unfocused.reduce((pre, block) => Math.max(pre, block.zIndex), -Infinity);

                focused.forEach(block => block.zIndex = maxZIndex + 1);

                return configData.value.blocks;
            })();

            return {
                redo: () => {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo: () => {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 置底
    register({
        name: "placeBottom",
        pushQueue: true,
        queueName: "置底",
        execute() {
            const before = deepClone(configData.value.blocks);

            const after = (() => {
                const { focused, unfocused } = focusData.value;

                let minZIndex = unfocused.reduce((pre, block) => Math.min(pre, block.zIndex), Infinity) - 1;

                if (minZIndex < 0) {
                    const delta = Math.abs(minZIndex);
                    unfocused.forEach(block => block.zIndex += delta);
                    minZIndex = 0;
                }

                focused.forEach(block => block.zIndex = minZIndex);

                return configData.value.blocks;
            })();

            return {
                redo: () => {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo: () => {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 删除
    register({
        name: "delete",
        pushQueue: true,
        queueName: "删除元素",
        keycodes: "delete",
        execute() {
            const before = deepClone(configData.value.blocks);
            const after = focusData.value.unfocused;

            return {
                redo: () => {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo: () => {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 更新单个元素
    register({
        name: "updateBlock",
        pushQueue: true,
        queueName: "更新单个元素",
        execute(newBlock: BlockData, oldBlock: BlockData, queueName?: string) {
            const before = configData.value.blocks;

            const after = (() => {
                const blocks = [...configData.value.blocks];
                const index = configData.value.blocks.indexOf(oldBlock);
                if (index > -1) {
                    blocks.splice(index, 1, newBlock);
                }

                return blocks;
            })();

            return {
                queueName: queueName || this.queueName,
                redo: () => {
                    configData.value = { ...configData.value, blocks: after }
                },
                undo: () => {
                    configData.value = { ...configData.value, blocks: before }
                }
            }
        }
    });

    // 监控键盘快捷键
    (() => {
        const keyCodesMap: Record<number, string> = {
            89: 'y',
            90: 'z',
            46: 'delete'
        }

        const onKeydown = (e: KeyboardEvent) => {
            const { ctrlKey, keyCode } = e;
            let keyString: string[] | string = [];

            if (ctrlKey) { keyString.push('ctrl') }
            keyString.push(keyCodesMap[keyCode]);
            keyString = keyString.join('+');

            state.commandArray.forEach(({ keycodes, name }) => {
                if (!keycodes) return;
                if (keycodes === keyString) {
                    e.preventDefault();
                    state.commands[name]();
                }
            })
        }

        const init = () => {
            window.addEventListener('keydown', onKeydown);
            return () => {
                window.removeEventListener('keydown', onKeydown)
            }
        }

        state.destroyArray.push(init());
    })();

    // 统一执行command的init方法
    state.commandArray.forEach(command => command.init && state.destroyArray.push(command.init()));

    // 卸载时，统一执行command的init销毁方法
    onBeforeUnmount(() => {
        state.destroyArray.filter(v => v).forEach(destroy => destroy());
    });

    return state;
}