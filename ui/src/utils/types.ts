export type Feature = {
  name: string;
  audiences: (number | string)[];
  progression?: number;
  client?: (number | string)[];
  server?: (number | string)[];
};

export type Application = {
  name: string;
  audiences: string[];
  features: Feature[];
};
