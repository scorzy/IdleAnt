import * as decimal from 'break_infinity.js';

declare global {
  interface Decimal {
    lessThanOrEqualTo(other: decimal.Decimal): boolean
    lessThan(other: decimal.Decimal): boolean

    greaterThan(other: decimal.Decimal): boolean
    greaterThanOrEqualTo(other: decimal.Decimal): boolean

  }
}
