declare let numberformat;
declare let setCss: any;

export class Options {
  header = 5;
  dark = false;
  usaFormat = false;
  numFormat = "T";
  formatter = new numberformat.Formatter({
    format: "standard",
    flavor: "short"
  });
  width = 0;
  height = 0;

  constructor() {
    this.generateFormatter();
  }

  apply() {
    setCss(this.dark);
  }
  generateFormatter() {
    this.formatter = new numberformat.Formatter({
      format:
        this.numFormat === "T"
          ? "standard"
          : this.numFormat === "S"
            ? "scientific"
            : this.numFormat === "E"
              ? "engineering"
              : "longScale",
      sigfigs: 3,
      flavor: "short"
    });
  }
  load(data: any) {
    if (data.header) this.header = data.header;
    if (data.dark) this.dark = data.dark;
    if (data.usaFormat) this.usaFormat = data.usaFormat;
    if (data.numFormat) this.numFormat = data.numFormat;
    if (data.width) this.width = data.width;
    if (data.height) this.height = data.height;

    this.generateFormatter();
  }
}
