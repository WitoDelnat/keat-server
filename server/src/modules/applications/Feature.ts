import type { Audience } from "./Application";

export class Feature {
  public name: string;
  public audiences: Audience[];

  constructor(init: { name: string; audiences?: Audience[] }) {
    this.name = init.name;
    this.audiences = init.audiences ?? [];
  }

  get progression(): number | undefined {
    const audiences = this.audiences;
    const progression = audiences.find((a) => typeof a === "number");
    return typeof progression === "number" ? progression : undefined;
  }
}
