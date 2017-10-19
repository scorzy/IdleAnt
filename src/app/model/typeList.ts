import { Base } from './units/base'
import { Unit } from './units/unit'

export class TypeList {
    isCollapsed = false
    isEnding = false
    constructor(
        public type = "",
        public list = new Array<Unit>()
    ) { }
}
