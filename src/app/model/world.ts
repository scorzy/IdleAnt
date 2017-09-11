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
        if (this.avaiableUnits)
            this.avaiableUnits.forEach(u => u.avabileThisWorld = true)
        if (this.unlockedUnits) {
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
        return new World(game, "base",
            [],
            [],
            [
                new Cost(game.food, Decimal(1E1)),
                //  new Cost(game.maxAnt,Decimal(100))
            ]
        )
    }

    static getRandomWorld(game: GameModel): World {
        const worldRet = this.getBaseWorld(game)

        const worldType = World.worldTypes[Math.floor(Math.random() * (World.worldTypes.length))]
        const worldPrefix = World.worldPrefix[Math.floor(Math.random() * (World.worldPrefix.length))]
        const worldSuffix = World.worldSuffix[Math.floor(Math.random() * (World.worldSuffix.length))]

        const worlds = [worldType, worldPrefix, worldSuffix, this.getBaseWorld(game)]
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
            w.toUnlock.forEach(p => {
                const toUnlock = worldRet.toUnlock.find(c => c.unit.id == p.unit.id)
                if (toUnlock)
                    toUnlock.basePrice = toUnlock.basePrice.plus(p.basePrice)
                else
                    worldRet.toUnlock.push(new Cost(p.unit, p.basePrice))
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
                "Park",
                [],
                [],
                []
            ),
            new World(game,
                "Beach",
                [],
                [[game.sand, Decimal(2)]],
                [new Cost(game.crabQueen, Decimal(1000))],
                Decimal(1), [], [],
                [game.seaRes]
            )
        ]

        World.worldPrefix = [
            new World(game, "Cold",
                [],
                [[game.food, Decimal(0.5)]],
                [],
                Decimal(1.2)),
            new World(game, "Freezing",
                [],
                [[game.food, Decimal(0.25)]],
                [],
                Decimal(1.5)),
            new World(game, "Hot",
                [],
                [[game.food, Decimal(2)]],
                []
            ),
            new World(game, "Arid",
                [],
                [[game.fungus, Decimal(0.5)]],
                [],
                Decimal(1.2)
            ),
            new World(game, "Wooded",
                [],
                [[game.wood, Decimal(2)]],
                []
            ),
            new World(game, "Crystallized",
                [],
                [
                    [game.cristal, Decimal(2)],
                    [game.food, Decimal(0.75)],
                    [game.fungus, Decimal(0.75)]
                ],
                []
            ),
            new World(game, "Dying",
                [],
                [
                    [game.food, Decimal(0.6)],
                    [game.fungus, Decimal(0.6)],
                    [game.wood, Decimal(0.6)],
                    [game.honey, Decimal(0.6)],
                    [game.nectar, Decimal(0.6)]
                ],
                [], Decimal(2)
            ),
            new World(game, "Rainy",
                [],
                [
                    [game.wood, Decimal(1.5)],
                    [game.fungus, Decimal(1.5)]
                ], []
            ),
            new World(game, "Foggy",
                [],
                [
                    [game.wood, Decimal(0.8)],
                    [game.fungus, Decimal(0.8)]
                ], [], Decimal(1.3)
            ),
            new World(game, "Technological",
                [],
                [
                    [game.science, Decimal(1.5)]
                ], []
            ),



        ]

        World.worldSuffix = [
            new World(game,
                "of Fungus",
                [],
                [[game.fungus, Decimal(4)]],
                [new Cost(game.fungus, Decimal(1000))],
                Decimal(1.1)
            ),
            new World(game,
                "of Bee",
                [], [], [],
                Decimal(1),
                [[game.foragingBee, Decimal(2)]]
            ),
            new World(game,
                "of Ant",
                [], [], [],
                Decimal(1),
                [[game.foragingBee, Decimal(2)]]
            ),
            new World(game,
                "of Scientist",
                [], [], [],
                Decimal(1),
                [[game.scientist, Decimal(2)]]
            ),
            new World(game,
                "of Farming",
                [], [], [],
                Decimal(1),
                [[game.farmer, Decimal(2)]]
            ),
            new World(game,
                "of Cristall",
                [],
                [[game.cristal, Decimal(2)]],
                []
            )
        ]

    }
}


