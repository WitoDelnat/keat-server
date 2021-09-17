import { isEmpty, remove } from "lodash";
import type { Readable } from "stream";

/**
 * A server-sent event, consisting of the following properties:
 * - id: the identifier of the event.
 * - type: the type, for example `'userconnect'` or `'usermessage'`.
 * - data: the data.
 * - retry: reconnection time, in milliseconds.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
 */
export type ServerSentEvent = {
  id?: string;
  type?: string;
  data: Object;
  retry?: number;
};

export class EventDispatcher {
  streams: Record<string, Readable[]> = {};

  constructor() {}

  addEventStream(id: string, stream: Readable) {
    if (!this.streams[id]) {
      this.streams[id] = [];
    }
    this.streams[id].push(stream);
  }

  removeEventStream(id: string, stream: Readable) {
    remove(this.streams[id], (s) => s === stream);
  }

  dispatch(id: string, event: ServerSentEvent) {
    const streams = this.streams[id];
    if (!streams) return;
    const payload = this.serialize(event);
    streams.forEach((stream) => {
      stream.push(payload);
    });
  }

  serialize(event: ServerSentEvent): string {
    if (isEmpty(event)) return "";

    const { id, type, retry, data } = event;
    const result = [];

    if (id) result.push(`id: ${id}\n`);
    if (type) result.push(`event: ${type}\n`);
    if (retry) result.push(`retry: ${retry}\n`);
    if (data) result.push(`data: ${JSON.stringify(data)}\n`);
    result.push("\n");

    return result.join("");
  }
}
