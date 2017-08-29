import { GameModel } from '../gameModel';

export class Base {
    constructor(
        public game: GameModel,
        public id: string,
        public name = "",
        public description = "",
        public unlocked = false,
        public quantity = Decimal(0)
    ) {
        this.game.allBase.push(this)
    }

    //     Save and Load
    getData() {
        const data: any = {}
        data.q = this.quantity
        data.u = this.unlocked
        data.id = this.id
        return data;
    }
    restore(data: any) {
        this.quantity = new Decimal(data.q)
        this.unlocked = data.u
    }

    initialize(){
        this.unlocked = false
        this.quantity = Decimal(0)
    }
}