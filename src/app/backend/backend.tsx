export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

export interface IEvent {
  id: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

export function getCalendars(): Promise<ICalendar[]> {
  return fetch('http://localhost:8080/calendars').then(response => response.json());
} 

export function getEvents(from: string, to: string): Promise<IEvent[]> {
  return fetch(`http://localhost:8080/events?date_gte=${from}&date_lte=${to}&_sort=date,time`).then(response => response.json());
}