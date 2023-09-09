import axios from 'axios';
import 'dotenv/config';
import express from 'express';
import { ChurchToolEvent, Event } from './types';
import { logger } from './utils/logger';

const app = express();

// Check if all important environment variables are set
if (!process.env.TOKEN) {
  logger.error('No token provided');
  process.exit(1);
}

if (!process.env.URL) {
  logger.error('No url provided');
  process.exit(1);
}

const CALENDAR_IDS = process.env.CALENDARS?.split(', ') ?? [];
if (CALENDAR_IDS.length === 0) {
  logger.error('No calendar ids provided');
  process.exit(1);
}

const date = new Date();
const START_DATE = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;
const date2 = new Date(
  date.setMonth(date.getMonth() + Number(process.env.MONTHS) ?? 2)
);
const END_DATE = `${date2.getFullYear()}-${
  date2.getMonth() + 1
}-${date2.getDate()}`;

let events: Event[] = [];

app.use(express.static('public'));

const AXIOS_HEADERS = {
  Accept: 'application/json',
  Authorization: `Login ${process.env.TOKEN}`
};

/**
 * Get all events from the calendars in CALENDAR_IDS
 * @returns {Promise<void>}
 */
async function getAllEvents() {
  for (const id of CALENDAR_IDS) {
    try {
      const response = await axios.get(
        `${process.env.URL}/calendars/${id}/appointments?from=${START_DATE}&to=${END_DATE}`,
        {
          headers: AXIOS_HEADERS
        }
      );

      const data = response.data.data;
      const filteredEvents: ChurchToolEvent[] = filtertEvents(data);

      const remappedEvents: Event[] = filteredEvents.map(
        (event: ChurchToolEvent) => {
          return {
            id: event.base.id,
            title: event.base.caption,
            start: event.base.startDate,
            end: event.base.endDate,
            allDay: event.base.allDay,
            description: event.base.note,
            location: event.base.address,
            link: event.base.link,
            image: event.base.image?.fileUrl ?? ''
          };
        }
      );

      events = [...events, ...remappedEvents];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Failed to get events from calendar ${id}: ${error.response?.status}`
        );
      } else {
        logger.error(`Failed to get events from calendar ${id}`);
      }
    }
  }
  logger.log(`Successfully fetched ${events.length} events`);
}

/**
 * Filter out events that does not start with '-'
 * @param events : Event[]
 * @returns events : Event[]
 */
function filtertEvents(events: ChurchToolEvent[]) {
  return events.filter((event: ChurchToolEvent) => {
    return event.base.note.startsWith('-');
  });
}

app.get('/events', async (req, res) => {
  if (events.length === 0) {
    await getAllEvents();
  }
  res.send(events);
});

app.listen(process.env.PORT ?? 3000, () => {
  logger.log(`Server running on port ${process.env.PORT}`);
});

getAllEvents();
