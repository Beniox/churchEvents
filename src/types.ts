export interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description: string;
  location: null;
  link: string;
  image: string;
}

export interface ChurchToolEvent {
  base: Base;
  calculated: Calculated;
}

export interface Base {
  id: number;
  caption: string;
  note: string;
  address: null;
  version: number;
  calendar: Calendar;
  information: string;
  image: null | Image;
  link: string;
  isInternal: boolean;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  repeatId: number;
  repeatFrequency: number;
  repeatUntil: Date;
  repeatOption: number;
  additions: never[];
  exceptions: Exception[];
  signup: null;
  meta: BaseMeta;
  onBehalfOfPid: null;
}

interface Image {
  id: number;
  fileUrl: string;
}

export interface Calendar {
  id: number;
  name: string;
  nameTranslated: string;
  sortKey: number;
  color: string;
  isPublic: boolean;
  isPrivate: boolean;
  randomUrl: string;
  iCalSourceUrl: null;
  campusId: null;
  eventTemplateId: null;
  meta: CalendarMeta;
}

export interface CalendarMeta {
  modifiedDate: Date;
  modifiedPid: number;
}

export interface Exception {
  id: number;
  date: Date;
  meta: CalendarMeta;
}

export interface BaseMeta {
  createdDate: Date;
  createdPerson: EdPerson;
  modifiedDate: Date;
  modifiedPerson: EdPerson;
}

export interface EdPerson {
  id: string;
}

export interface Calculated {
  startDate: Date;
  endDate: Date;
}
