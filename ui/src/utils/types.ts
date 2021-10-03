export type Audience = boolean | number | string;

export type Feature = {
  name: string;
  audiences: Audience[];
  progression?: number;
  client?: Audience[];
  server?: Audience[];
};

export type Application = {
  name: string;
  audiences: string[];
  features: Feature[];
};
