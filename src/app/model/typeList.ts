import { Unit } from './units/unit';
export class TypeList {
    isCollapsed = false
    constructor(
        public type = "",
        public list = new Array<Unit>()
    ) { }
}