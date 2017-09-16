import { Cost } from './cost';
import { GameModel } from './gameModel';
import { Unit } from './units/unit';
import { Base } from './units/base';
import { Action } from './units/action';

export class World {

    static worldPrefix: World[]
    static worldTypes: World[]
    static worldSuffix: World[]

    public prestige: Action
    public level = 1

    constructor(
        public game: GameModel,
        public name: string,
        public avaiableUnits: Base[],
        public prodMod: [Unit, decimal.Decimal][],
        public toUnlock: Cost[],
        public unitMod: [Unit, decimal.Decimal][] = [],
        public unitPrice: [Unit, decimal.Decimal][] = [],
        public unlockedUnits: [Base, decimal.Decimal][] = [],
        public experience = Decimal(2.5)
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
            this.unlockedUnits.forEach(u => {
                u[0].avabileThisWorld = true
                u[0].quantity = u[1]
            })
            this.game.unlockUnits(this.unlockedUnits.map(u => u[0]))()
        }
        if (this.prodMod)
            this.prodMod.forEach(p => p[0].worldProdModifiers = p[1])
        if (this.unitMod)
            this.unitMod.forEach(p => p[0].worldEffModifiers = p[1])
        if (this.unitPrice)
            this.unitPrice.forEach(p => p[0].worldBuyModifiers = p[1])


        this.game.world = this
        this.game.world.generateAction(this.game)

        this.game.prestigeDone = this.game.prestigeDone.plus(1)
    }

    static getBaseWorld(game: GameModel): World {
        const baseWorld = new World(game, "base",
            [],
            [],
            [
                new Cost(game.food, Decimal(1E1)),
                //  new Cost(game.maxAnt,Decimal(100))
            ]
        )
        baseWorld.experience = Decimal(10)
        return baseWorld
    }

    static getRandomWorld(game: GameModel): World {
        const worldRet = this.getBaseWorld(game)
        worldRet.experience = Decimal(0)

        const worldType = World.worldTypes[Math.floor(Math.random() * (World.worldTypes.length))]
        const worldPrefix = World.worldPrefix[Math.floor(Math.random() * (World.worldPrefix.length))]
        const worldSuffix = World.worldSuffix[Math.floor(Math.random() * (World.worldSuffix.length))]

        const worlds = [worldType, worldPrefix, worldSuffix, this.getBaseWorld(game)]
        worldRet.name = worldPrefix.name + " " + worldType.name + " " + worldSuffix.name

        worlds.forEach(w => {
            w.prodMod.forEach(p => {
                const prod = worldRet.prodMod.find(p1 => p1[0].id == p[0].id)
                if (prod)
                    prod[1] = prod[1].plus(p[1])
                else
                    worldRet.prodMod.push([p[0], p[1].plus(1)])
            })
            w.unitMod.forEach(p => {
                const prod = worldRet.unitMod.find(p1 => p1[0].id == p[0].id)
                if (prod)
                    prod[1] = prod[1].plus(p[1])
                else
                    worldRet.unitMod.push([p[0], p[1].plus(1)])
            })
            w.unitPrice.forEach(p => {
                const prod = worldRet.unitPrice.find(p1 => p1[0].id == p[0].id)
                if (prod)
                    prod[1] = prod[1].plus(p[1])
                else
                    worldRet.unitPrice.push([p[0], p[1].plus(1)])
            })
            w.toUnlock.forEach(p => {
                const toUnlock = worldRet.toUnlock.find(c => c.unit.id == p.unit.id)
                if (toUnlock)
                    toUnlock.basePrice = toUnlock.basePrice.plus(p.basePrice)
                else
                    worldRet.toUnlock.push(new Cost(p.unit, p.basePrice))
            })
            w.unlockedUnits.forEach(p => {
                const unlockedUnits = worldRet.unlockedUnits.find(p1 => p1[0].id == p[0].id)
                if (unlockedUnits)
                    unlockedUnits[1] = unlockedUnits[1].plus(p[1])
                else
                    worldRet.unlockedUnits.push([p[0], p[1]])
            })
            worldRet.experience = worldRet.experience.plus(w.experience)
            worldRet.avaiableUnits = worldRet.avaiableUnits.concat(w.avaiableUnits)
        })
        worldRet.avaiableUnits = Array.from(new Set(worldRet.avaiableUnits))

        //    Set the world level
        let maxLevel = game.allPrestigeUp.map(u => u.quantity).reduce((prev, prest) => prev.plus(prest))
        maxLevel = maxLevel.greaterThan(0) ? maxLevel.ln().floor() : maxLevel
        worldRet.level = Math.min(maxLevel.times(Decimal.random()).floor().toNumber(), 100)

        const toUnlockMultiplier = Decimal.pow(1.07, worldRet.level)
        const expMultiplier = Decimal.pow(1.075, worldRet.level)
        worldRet.toUnlock.forEach(t => t.basePrice = t.basePrice.times(toUnlockMultiplier))
        worldRet.experience = worldRet.experience

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
        data.um = this.unitMod.map(up => [up[0].id, up[1]])
        data.up = this.unitPrice.map(up => [up[0].id, up[1]])
        data.uu = this.unlockedUnits.map(up => [up[0].id, up[1]])
        data.e = this.experience
        data.l = this.level
        return data
    }

    restore(data: any) {
        this.name = data.n
        if (data.a)
            this.avaiableUnits = data.a.map(a => this.game.allBase.find(u => u.id == a))
        if (data.p)
            this.prodMod = data.p.map(p => [this.game.all.find(u => u.id == p[0]), Decimal(p[1])])
        this.toUnlock = data.t.map(c => this.game.getCost(c))
        if (data.um)
            this.unitMod = data.um.map(p => [this.game.all.find(u => u.id == p[0]), Decimal(p[1])])
        if (data.up)
            this.unitPrice = data.up.map(p => [this.game.all.find(u => u.id == p[0]), Decimal(p[1])])
        if (data.uu)
            this.unlockedUnits = data.uu.map(p => [this.game.all.find(u => u.id == p[0]), Decimal(p[1])])
        if (data.e)
            this.experience = new Decimal(data.e)
        if (data.l)
            this.level = data.l
    }

    generateAction(game: GameModel) {
        this.prestige = new Action("pres", "", null, this.toUnlock, "", game)
        this.prestige.priceF.forEach(pf => pf.growFactor = Decimal(10))
        this.prestige.unlocked = true
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
                [game.seaRes,game.sandDigger],
                [[game.sand, Decimal(0.5)], [game.fungus, Decimal(-0.2)]],
                [new Cost(game.crabQueen, Decimal(1000))],
                [[game.fungus, Decimal(-0.2)]],
                []
            )
        ]

        World.worldPrefix = [
            new World(game, "", [], [], []),
            new World(game, "Cold",
                [],
                [[game.food, Decimal(-0.5)]],
                []),
            new World(game, "Freezing",
                [],
                [[game.food, Decimal(-0.7)]],
                []),
            new World(game, "Hot",
                [],
                [[game.food, Decimal(1)]],
                []
            ),
            new World(game, "Arid",
                [],
                [[game.fungus, Decimal(-0.5)]],
                []
            ),
            new World(game, "Wooded",
                [],
                [[game.wood, Decimal(1)]],
                []
            ),
            new World(game, "Crystallized",
                [],
                [
                    [game.cristal, Decimal(1)],
                    [game.food, Decimal(-0.3)],
                    [game.fungus, Decimal(-0.3)]
                ],
                []
            ),
            new World(game, "Dying",
                [],
                [
                    [game.food, Decimal(-0.4)],
                    [game.fungus, Decimal(-0.4)],
                    [game.wood, Decimal(-0.4)],
                    [game.honey, Decimal(-0.4)],
                    [game.nectar, Decimal(-0.4)]
                ],
                []
            ),
            new World(game, "Rainy",
                [],
                [
                    [game.wood, Decimal(0.5)],
                    [game.fungus, Decimal(0.5)]
                ], []
            ),
            new World(game, "Foggy",
                [],
                [
                    [game.wood, Decimal(-0.2)],
                    [game.fungus, Decimal(-0.2)]
                ], []
            ),
            new World(game, "Technological",
                [],
                [
                    [game.science, Decimal(0.5)]
                ], []
            ),
        ]

        World.worldSuffix = [
            new World(game, "", [], [], []),
            new World(game,
                "of Fungus",
                [],
                [[game.fungus, Decimal(1)]],
                [new Cost(game.fungus, Decimal(1000))]
            ),
            new World(game,
                "of Bee",
                [], [], [],
                [[game.foragingBee, Decimal(1)]]
            ),
            new World(game,
                "of Ant",
                [], [], [],
                [[game.foragingBee, Decimal(1)]]
            ),
            new World(game,
                "of Scientist",
                [], [], [],
                [[game.scientist, Decimal(1)]]
            ),
            new World(game,
                "of Farming",
                [], [], [],
                [[game.farmer, Decimal(1)]]
            ),
            new World(game,
                "of Cristall",
                [],
                [[game.cristal, Decimal(1)]],
                []
            )
        ]

    }
}


