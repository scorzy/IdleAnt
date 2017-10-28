import * as decimal from 'decimal.js'

export class Utils {

  static cuberoot(x: decimal.Decimal): decimal.Decimal {
    const y = x.abs().pow(1 / 3)
    return x.lessThan(0) ? y.times(-1) : y
  }

  static solveCubic(a: decimal.Decimal, b: decimal.Decimal, c: decimal.Decimal, d: decimal.Decimal)
    : decimal.Decimal[] {

    //  Thanks to:
    // https://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically

    // console.log(a.toString() + "x^3 " + b.toString() + "x^2 " + c.toString() + "x " + d.toString())

    if (a.abs().lessThan(Number.EPSILON)) { // Quadratic case, ax^2+bx+c=0
      a = b; b = c; c = d
      if (a.abs().lessThan(Number.EPSILON)) { // Linear case, ax+b=0
        a = b; b = c
        if (a.abs().lessThan(Number.EPSILON)) // Degenerate case
          return []
        return [b.times(-1).div(a)]
      }

      const D = b.pow(2).minus(a.times(c).times(4))
      // console.log(D.toString())
      if (D.abs().lessThan(Number.EPSILON))
        return [b.times(-1).div(a.times(2))]
      else if (D.greaterThan(0))
        return [(D.sqrt().minus(b)).div(a.times(2)), ((D.sqrt().plus(b)).times(-1)).div(a.times(2))]
      return []
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    const p = a.times(c).times(3).minus(b.pow(2)).div(3).div(a).div(a)
    const q = ((b.pow(3).times(2)).minus(a.times(b).times(c).times(9)).plus(a.times(a).times(d).times(27)))
      .div(a.pow(3).times(27))
    let roots: decimal.Decimal[]

    if (p.abs().lessThan(Number.EPSILON)) { // p = 0 -> t^3 = -q -> t = -q^1/3
      roots = [this.cuberoot(q.times(-1))]
    } else if (q.abs().lessThan(Number.EPSILON)) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
      roots = [Decimal(0)].concat(p.lessThan(0) ? [(p.times(-1)).sqrt(), (p.times(-1)).sqrt().times(-1)] : [])
    } else {
      const D = q.pow(2).div(Decimal(4).plus(p.pow(3).div(27)))
      // console.log("D: " + D.toString())

      if (D.abs().lessThan(Number.EPSILON)) {       // D = 0 -> two roots
        roots = [q.times(-1.5).div(p), Decimal(3).times(q).times(p)]
      } else if (D.greaterThan(0)) {             // Only one real root
        // var u = cuberoot(-q/2 - Math.sqrt(D));
        // roots = [u - p/(3*u)];
        const u = this.cuberoot(q.times(-0.5).minus(D.sqrt()))
        roots = [u.minus(p.div(u.times(3)))]
      } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
        const u = Decimal(2).times(Decimal.sqrt(p.times(-1).div(3)))
        // console.log(q.toString() + " " + p.toString() + " " + u.toString())
        // let acos = Decimal(3).times(q).div(p).div(u)

        let acos = q
        acos = acos.div(p)
        acos = acos.div(u)
        acos = acos.times(3)
        //  workaround for aprossimation
        if (acos.lessThan(-1))
          return []

        //  workaround for aprossimation 2
        acos = Decimal.min(Decimal.max(acos, 1), -1)
        const t = Decimal.acos(acos).div(3)

        // const t = Math.acos(3 * q / p / u) / 3;  // D < 0 implies p < 0 and acos argument in [-1..1]
        const k = Decimal(2).times(Math.PI).div(3)
        roots = [u.times(t.cos()), u.times((t.minus(k)).cos()), u.times(t.minus(k.times(2)).cos())]

        // console.log(roots[0].toString())
        // console.log(roots[1].toString())
        // console.log(roots[2].toString())

      }
    }

    // Convert back from depressed cubic
    for (let i = 0; i < roots.length; i++)
      roots[i] = roots[i].minus(b.div(a.times(3)))

    return roots
  }

}

export class Unlocable {
  constructor(
    public unlocked = true,
    public avabileThisWorld = true
  ) { }
}
