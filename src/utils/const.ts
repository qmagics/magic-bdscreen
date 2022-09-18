import { Manager } from "@/packages/manager";
import { InjectionKey } from "vue";

export const MANAGER_KEY = Symbol("manager") as InjectionKey<Manager>;