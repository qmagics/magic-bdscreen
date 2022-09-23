import { InjectionKey } from "vue";
import { UseCommandsState } from "./editor/hooks/useCommands";

export const COMMANDS_KEY: InjectionKey<UseCommandsState['commands']> = Symbol('commands');