import { ConfigData } from "@/types";
import { deepClone } from "@/utils";
import { dataType } from "element-plus/es/components/table-v2/src/common";
import { onBeforeUnmount, WritableComputedRef } from "vue";
import events from "../events";
import { FocusData } from "./useFocus";

export interface Command {
    /** 指令名称 */
    name: string;

    /** 指令运行内容 */
    execute: (...args: any) => { [key: string]: any; redo: Function };

    /** 指令初始化执行方法 */
    init?: Function;

    /** 指令键盘快捷键 */
    keycodes?: string;

    /** 指令是否添加进操作队列（可实现撤销和重做） */
    pushQueue?: boolean;

    /** 自定义属性 */
    [key: string]: any;
}

export interface UseCommandsState {
    current: number;
    queue: { undo: Function, redo: Function }[];
    commands: Record<string, Function>;
    commandArray: Command[];
    destroyArray: Function[];
}

export const useCommands = (configData: WritableComputedRef<ConfigData>, focusData: FocusData) => {
    const state: UseCommandsState = {
        current: -1,
        queue: [],
        commands: {},
        commandArray: [],
        destroyArray: []
    }

    /** 注册命令*/
    const register = (command: Command) => {
        state.commandArray.push(command);
        state.commands[command.name] = (...args: any) => {
            const { redo, undo } = command.execute(...args);
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

            queue.push({ redo, undo });
            state.current = current + 1;
        }
    }

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
                redo() {
                    if (state.current == -1) return;
                    const item = state.queue[state.current];

                    if (item) {
                        item.undo();
                        state.current--;
                    }
                }
            }
        }
    });

    // 拖拽事件（包括：从物料库拖拽进画布 和 对画布中区块的拖拽）
    register({
        name: "drag",
        pushQueue: true,
        init() {
            this.before = null;

            const start = () => this.before = deepClone(configData.value.blocks);

            const end = () => state.commands.drag();

            events.on('dragStart', start);
            events.on('dragEnd', end);

            return () => {
                events.off('dragStart', start);
                events.off('dragEnd', end);
            }
        },
        execute() {
            const before = this.before;
            const after = configData.value.blocks;
            return {
                redo() {
                    configData.value = { ...configData.value, blocks: after };
                },
                undo() {
                    configData.value = { ...configData.value, blocks: before };
                }
            }
        }
    });

    // 更新整个配置文件
    register({
        name: "updateConfigData",
        pushQueue: true,
        execute(newConfigData) {
            const before = configData.value;
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

    // 监控键盘快捷键
    (() => {
        const keyCodesMap: Record<number, string> = {
            89: 'y',
            90: 'z',
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