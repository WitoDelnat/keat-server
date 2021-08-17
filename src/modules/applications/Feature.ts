export class Feature {
  public name: string;
  public client?: string[];
  public server?: string[];

  constructor(init: { name: string; client?: string[]; server?: string[] }) {
    this.name = init.name;
    this.client = init.client;
    this.server = init.server;
  }

  get audiences(): string[] {
    return this.server ?? this.client ?? [];
  }

  get progression(): number | undefined {
    const audiences = this.audiences;

    if (audiences.some((a) => a === "nobody")) return 0;
    if (audiences.some((a) => a === "everyone")) return 100;

    const rollout = audiences.find((a) => a.startsWith("rollout-"));
    return rollout ? Number(rollout.replace("rollout-", "")) : undefined;
  }
}
