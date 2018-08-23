export class IAlert {
  id: number;
  type: string;
  message: string;
}
export class Alert implements IAlert {
  static maxId = 0;
  public id: number;

  constructor(public type: string, public message: string) {
    this.id = Alert.maxId++;
  }
}

export const alertArray: Array<IAlert> = [new Alert("info", "welcome")];
