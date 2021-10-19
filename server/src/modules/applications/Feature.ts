import { differenceInDays } from "date-fns";
import { logger } from "../../utils/logger";
import type { Audience } from "./Application";

export type Lifecycle = "unseen" | "fresh" | "stale" | "rotten";

const DAYS_UNTIL_STALE = 7;
const DAYS_UNTIL_ROTTEN = 7;

export class Feature {
  public name: string;
  public audiences: Audience[];
  public lastSeen: Date | undefined;

  constructor(init: { name: string; audiences?: Audience[]; lastSeen?: Date }) {
    this.name = init.name;
    this.audiences = init.audiences ?? [];
    this.lastSeen = init.lastSeen;
  }

  get lifecycle(): Lifecycle | undefined {
    if (!this.lastSeen) {
      return "unseen";
    }
    const daysSince = differenceInDays(this.lastSeen, new Date());
    if (daysSince > DAYS_UNTIL_STALE + DAYS_UNTIL_ROTTEN) {
      return "rotten";
    }
    if (daysSince > DAYS_UNTIL_STALE) {
      return "stale";
    }
    return "fresh";
  }

  get progression(): number | undefined {
    const audiences = this.audiences;
    const progression = audiences.find((a) => typeof a === "number");
    return typeof progression === "number" ? progression : undefined;
  }

  spot(timestamp: Date = new Date()) {
    logger.info("SPOT", this.name, timestamp);
    this.lastSeen = timestamp;
  }
}
