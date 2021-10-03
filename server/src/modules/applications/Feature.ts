import type { Audience } from "./Application";

export class Feature {
  public name: string;
  public client?: Audience[];
  public server?: Audience[];

  constructor(init: {
    name: string;
    client?: Audience[];
    server?: Audience[];
  }) {
    this.name = init.name;
    this.client = init.client;
    this.server = init.server;
  }

  get audiences(): Audience[] {
    return this.server ?? this.client ?? [];
  }

  get progression(): number | undefined {
    const audiences = this.audiences;
    const progression = audiences.find((a) => typeof a === "number");
    return typeof progression === "number" ? progression : undefined;
  }
}
