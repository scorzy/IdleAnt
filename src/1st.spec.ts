import { Utils } from './app/model/utils';
import * as decimal from 'decimal.js';

describe('1st tests', () => {
  it('true is true', () => expect(true).toBe(true));
});


describe('linear tests', () => {
  const result = Utils.solveCubic(new Decimal(0), new Decimal(0), new Decimal(1), new Decimal(-1))
  const actualJSON = JSON.stringify(result);
  const expectedJSON = JSON.stringify([new Decimal(1)]);
  it('1x -1 => x = 1', () => expect(actualJSON).toBe(expectedJSON))
});

describe('quadratic tests', () => {
  const result = Utils.solveCubic(new Decimal(0), new Decimal(1), new Decimal(-2), new Decimal(1))
  const actualJSON = JSON.stringify(result);
  const expectedJSON = JSON.stringify([new Decimal(1)]);
  it('x^2 - 2x + 1 => x = 1 ', () => expect(actualJSON).toBe(expectedJSON))
});

describe('quadratic test 2', () => {
  const result = Utils.solveCubic(new Decimal(0), new Decimal(2), new Decimal(5), new Decimal(-3))
  const actualJSON = JSON.stringify(result);
  const expectedJSON = JSON.stringify([new Decimal(0.5), new Decimal(-3)]);
  it('2x^2 - 5x - 3 => x = -3  0.5 ', () => expect(actualJSON).toBe(expectedJSON))
});

describe('cubic tests', () => {
  const result = Utils.solveCubic(new Decimal(1), new Decimal(-7), new Decimal(4), new Decimal(12))
  const actualJSON = JSON.stringify(result);
  const expectedJSON = '["6","2.0000000000000006427","-1.0000000000000007345"]'
  it('x^3 – 7x^2 + 4x + 12 => x = 1 ', () => expect(actualJSON).toBe(expectedJSON))
});

describe('cubic tests 2', () => {
  const result = Utils.solveCubic(new Decimal(-44), new Decimal(1413637), new Decimal(800766291), new Decimal(187091096050))
  const actualJSON = JSON.stringify(result);
  const expectedJSON = '["6","2.0000000000000006427","-1.0000000000000007345"]'
  it('', () => expect(actualJSON).toBe(expectedJSON))
});

describe('cubic tests 3', () => {
  const result = Utils.solveCubic(new Decimal(168.22549160416666667),
    new Decimal(-62370.8640283213725), new Decimal(24818289.542591014547), new Decimal(155768059470.00133285))
  const actualJSON = JSON.stringify(result);
  const expectedJSON = '["-610.4248196959635"]' // should be -821.55127477998421
  it('', () => expect(actualJSON).toBe(expectedJSON))
});
