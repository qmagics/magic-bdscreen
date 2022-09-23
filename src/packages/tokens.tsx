import { InjectionKey } from "vue";
import { UseCommandsState } from "./editor/hooks/useCommands";
import { Manager } from "./manager";

export const COMMANDS_KEY: InjectionKey<UseCommandsState['commands']> = Symbol('commands');

export const MANAGER_KEY: InjectionKey<Manager> = Symbol("manager");