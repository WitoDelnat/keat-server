import Cache from "lru-cache";

export type ClientApp = {
  name: string;
  audiences?: string[];
  features?: string[];
};

const SEVEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 7;

export class DiscoveryCache {
  private cache = new Cache<string, true>({
    max: 20,
    maxAge: SEVEN_DAYS_IN_MS,
  });

  put(value: string) {
    this.cache.set(value, true);
  }

  putAll(values: string[]) {
    for (const value of values) {
      this.put(value);
    }
  }

  getAll(): string[] {
    this.cache.prune();
    return this.cache.keys();
  }
}
