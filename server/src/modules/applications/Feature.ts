export class Feature {
  public name: string;
  public client?: (number | string)[];
  public server?: (number | string)[];

  constructor(init: {
    name: string;
    client?: (number | string)[];
    server?: (number | string)[];
  }) {
    this.name = init.name;
    this.client = init.client;
    this.server = init.server;
  }

  get audiences(): (number | string)[] {
    return this.server ?? this.client ?? [];
  }

  get progression(): number | undefined {
    const audiences = this.audiences;

    if (audiences.some((a) => a === "nobody")) return 0;
    if (audiences.some((a) => a === "everyone")) return 100;

    const progression = audiences.find((a) => typeof a === "number");
    return typeof progression === "number" ? progression : undefined;
  }
}
