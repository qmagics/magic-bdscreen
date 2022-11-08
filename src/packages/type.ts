import { Manager } from "./manager";

export interface RegisterComponentFn {
    (manager: Manager): void;
}