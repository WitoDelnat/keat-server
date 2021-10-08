import type { Audience } from "./Application";

export class Feature {
  public name: string;
  public server?: Audience[];

  constructor(init: {
    name: string;
    client?: Audience[];
    server?: Audience[];
  }) {
    this.name = init.name;
    this.server = init.server;
  }

  get audiences(): Audience[] {
    return this.server ?? [];
  }

  get progression(): number | undefined {
    const audiences = this.audiences;
    const progression = audiences.find((a) => typeof a === "number");
    return typeof progression === "number" ? progression : undefined;
  }
}
