import { Interaction } from "discord.js";
import { EventName } from "./EventName";
import path from 'path';
import fs from 'fs';

const EVENT_HANDLERS_FOLDER = "./../eventhandler";

export default class Event {
  eventName!: EventName;
  callback: (interaction: Interaction) => any

  constructor(
    eventName: EventName, 
    callback: (interaction: Interaction) => any
  ) {
    this.eventName = eventName;
    this.callback = callback;
  }

  static async getConfiguredEvents(): Promise<Event[]> {
    let configuredEvents: Event[] = [];
    const normalizedPathEventHandlerFolder = path.join(__dirname, EVENT_HANDLERS_FOLDER);
    let eventHandlerFiles = fs.readdirSync(normalizedPathEventHandlerFolder);
    for (let eventHandlerFile of eventHandlerFiles) {
      let eventFileLocation = `${EVENT_HANDLERS_FOLDER}/${eventHandlerFile}`;
      const res = await import(eventFileLocation);
      configuredEvents.push(res.default);
    }
    return configuredEvents;
  }
}