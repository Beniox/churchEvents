import axios from 'axios';
import 'dotenv/config';
import express from 'express';
import { ChurchToolEvent, Event } from './types';

const app = express();

const CALENDAR_IDS = [8, 1];
const date = new Date();
const START_DATE = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;
const END_DATE = '2025-12-31';

let events: Event[] = [];

app.use(express.static('public'));

const AXIOS_HEADERS = {
  Accept: 'application/json',
  Authorization: `Login ${process.env.TOKEN}`
};

/**
 * Get all events from the calendars in CALENDAR_IDS
 */
async function getAllEvents() {
  for (const id of CALENDAR_IDS) {
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
  }
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

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${process.env.PORT}`);
});

getAllEvents();
