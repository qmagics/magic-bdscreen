import { ConfigData } from "@/types";
import { deepClone } from "@/utils";
import { onBeforeUnmount, WritableComputedRef } from "vue";
import events from "./events";

export interface Command {
    name: string;
    execute: (...args: any) => { [key: string]: any; redo: Function };
    init?: Function;
    keycodes?: string;
    pushQueue?: boolean;

    [key: string]: any;
}

export interface UseCommandsState {
    current: number;
    queue: { undo: Function, redo: Function }[];
    commands: Record<string, Function>;
    commandArray: Command[];
    destroyArray: Function[];
}

export const useCommands = (configData: WritableComputedRef<ConfigData>) => {
    const state: UseCommandsState = {
        current: -1,
        queue: [],
        commands: {},
        commandArray: [],
        destroyArray: []
    }

    const register = (command: Command) => {
        state.commandArray.push(command);
        state.commands[command.name] = () => {
            const { redo, undo } = command.execute();
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

    // 统一执行command的init方法
    state.commandArray.forEach(command => command.init && state.destroyArray.push(command.init()));

    // 统一执行command的init销毁方法
    onBeforeUnmount(() => {
        state.destroyArray.filter(v => v).forEach(destroy => destroy());
    });

    return state;
}