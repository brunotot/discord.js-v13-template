import { Interaction } from "discord.js";
import { EventName } from "./EventName";
import ImportUtils from "../util/ImportUtils";

const EVENT_HANDLERS_FOLDER = "./../eventhandler";

export default class Event {
  private static configuredEvents: Event[] = [];
  eventName!: EventName;
  callback: (interaction: Interaction) => void

  constructor(
    eventName: EventName,
    callback: (interaction: Interaction) => void
  ) {
    this.eventName = eventName;
    this.callback = callback;
  }

  static async getConfiguredEvents(): Promise<Event[]> {
    if (Event.configuredEvents.length > 0) return Event.configuredEvents;
    let configuredEvents = await ImportUtils.getConfiguredImports<Event>(EVENT_HANDLERS_FOLDER);
    Event.configuredEvents = configuredEvents;
    return configuredEvents;
  }
}