declare namespace Intl {
  class ListFormat {
    public format: (items: string[]) => string;
  }
}

export function formatList(list: string[]): string {
  return new Intl.ListFormat().format(list);
}
