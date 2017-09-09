import { Cost } from './cost';
import { GameModel } from './gameModel';
import { Unit } from './units/unit';
import { Base } from './units/base';

export class World {

    static worldPrefix: World[]
    static worldTypes: World[]
    static worldSuffix: World[]

    constructor(
        public game: GameModel,
        public name: string,
        public avaiableUnits: Base[],
        public prodMod: [Unit, decimal.Decimal][],
        public toUnlock: Cost[],
        public expMulti = Decimal(1),
        public unitMod: [Unit, decimal.Decimal][] = [],
        public unitPrice: [Unit, decimal.Decimal][] = [],
        public unlockedUnits: Base[] = []
    ) {
    }

    goTo() {
        const le = this.game.lifeEarning
        const exp = this.game.experience.quantity.plus(this.game.getExperience())
        this.game.setInitialStat()
        this.game.experience.quantity = exp
        if(this.avaiableUnits)
            this.avaiableUnits.forEach(u => u.avabileThisWorld = true)
        if (this.unlockedUnits){
            this.unlockedUnits.forEach(u => u.avabileThisWorld = true)
            this.game.unlockUnits(this.unlockedUnits)()
        }
        if (this.prodMod)
            this.prodMod.forEach(p => p[0].worldProdModifiers = p[1])
        if (this.unitMod)
            this.unitMod.forEach(p => p[0].worldEffModifiers = p[1])
        if (this.unitPrice)
            this.unitPrice.forEach(p => p[0].worldBuyModifiers = p[1])

        this.game.world = this
    }

    static getBaseWorld(game: GameModel): World {
        return new World(game, "base", [], [], [new Cost(game.food, Decimal(1000))])
    }

    static getRandomWorld(game: GameModel): World {
        console.log("getRandomWorld")
        const worldRet = new World(game, "base", [], [], [new Cost(game.food, Decimal(1000))])

        const worldType = World.worldTypes[Math.floor(Math.random() * (World.worldTypes.length))]
        const worldPrefix = World.worldPrefix[Math.floor(Math.random() * (World.worldPrefix.length))]
        const worldSuffix = World.worldSuffix[Math.floor(Math.random() * (World.worldSuffix.length))]

        const worlds = [worldType, worldPrefix, worldSuffix]
        worldRet.name = worldPrefix.name + " " + worldType.name + " " + worldSuffix.name

        worlds.forEach(w => {
            w.prodMod.forEach(p => {
                const prod = worldRet.prodMod.find(p1 => p1[0].id == p[0].id)
                if (prod)
                    prod[1] = prod[1].times(p[1])
                else
                    worldRet.prodMod.push([p[0], p[1]])
            })
            w.unitMod.forEach(p => {
                const prod = worldRet.unitMod.find(p1 => p1[0].id == p[0].id)
                if (prod)
                    prod[1] = prod[1].times(p[1])
                else
                    worldRet.unitMod.push([p[0], p[1]])
            })
            w.unitPrice.forEach(p => {
                const prod = worldRet.unitPrice.find(p1 => p1[0].id == p[0].id)
                if (prod)
                    prod[1] = prod[1].times(p[1])
                else
                    worldRet.unitPrice.push([p[0], p[1]])
            })

            worldRet.expMulti = worldRet.expMulti.times(w.expMulti)
            worldRet.avaiableUnits = worldRet.avaiableUnits.concat(w.avaiableUnits)
        })
        worldRet.avaiableUnits = Array.from(new Set(worldRet.avaiableUnits))

        return worldRet
    }

    getData() {
        const data: any = {}
        data.n = this.name
        if (this.avaiableUnits)
            data.a = this.avaiableUnits.map(b => b.id)
        if (this.prodMod)
            data.p = this.prodMod.map(p => [p[0].id, p[1]])

        data.t = this.toUnlock.map(c => c.getData())
        return data
    }

    restore(data: any) {
        this.name = data.n
        if (data.a)
            this.avaiableUnits = data.a.map(a => this.game.allBase.find(u => u.id == a))
        if (data.p)
            this.prodMod = data.p.map(p => [this.game.all.find(u => u.id == p[0]), Decimal(p[1])])
        this.toUnlock = data.t.map(c => this.game.getCost(c))
    }

    static initialize(game: GameModel) {
        World.worldTypes = [
            new World(game,
                "Beach",
                [game.seaRes],
                [[game.sand, Decimal(2)]],
                [new Cost(game.food, Decimal(1000))])
        ]

        World.worldPrefix = [
            new World(game, "Cold",
                [],
                [[game.food, Decimal(0.5)]],
                [],
                Decimal(1.1)),
            new World(game, "Hot",
                [],
                [[game.food, Decimal(1.5)]],
                []
            )
        ]

        World.worldSuffix = [
            new World(game,
                "of Fungus",
                [],
                [[game.fungus, Decimal(4)]],
                [new Cost(game.fungus,Decimal(1000))],
                Decimal(1.1)
            )
        ]

    }
}


