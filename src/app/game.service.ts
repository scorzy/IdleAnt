import * as decimal from 'decimal.js';
import { GameModel } from './model/gameModel';
import { log } from 'util';
import { Logger } from 'jasmine-spec-reporter/built/display/logger';
import { Injectable, OnInit } from '@angular/core';


@Injectable()
export class GameService {

    game: GameModel;
    last: number;
    selectedGen: string;
    list: any

    constructor() {
        this.game = new GameModel()
        this.last = Date.now()
        const l = this.load()
        if (l)
            this.last = l

        setInterval(this.update.bind(this), 1000 / 20)
    }

    update() {
        const now = new Date().getTime()
        this.game.longUpdate(now - this.last)
        this.last = now
    }

    clear() {
        localStorage.clear()
        this.game = new GameModel()
    }

    save() {
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('save', this.game.getSave())
        }
    }
    load(): number {
        if (typeof (Storage) !== 'undefined') {
            const saveRaw = localStorage.getItem('save')
            return this.game.load(saveRaw)
        }
    }

}
