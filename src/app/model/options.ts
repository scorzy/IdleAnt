declare let setCss: any

export class Options {

  public header = 5
  public dark = false

  constructor(
  ) { }

  apply() {
    setCss(this.dark)
  }
  load(data: any) {
    if (data.header)
      this.header = data.header

    if (data.dark)
      this.dark = data.dark
  }

}
