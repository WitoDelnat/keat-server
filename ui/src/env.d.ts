interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_TRPC_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
