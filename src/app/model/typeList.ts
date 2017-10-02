import {Base} from './units/base'
import { Unit } from './units/unit'

export class TypeList {
    isCollapsed = false
    constructor(
        public type = "",
        public list = new Array<Unit>()
    ) { }
}

// export class PrestigeList {
//     isCollapsed = false
//     constructor(
//         public type = "",
//         public list = new Array<Base>()
//     ) { }
// }
