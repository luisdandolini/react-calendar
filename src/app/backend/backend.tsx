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

export interface IUser {
  name: string;
  email: string;
}

export function getCalendars(): Promise<ICalendar[]> {
  return fetch('http://localhost:8080/calendars', {
    credentials: 'include'
  }).then(handleResponse);
} 

export function getEvents(from: string, to: string): Promise<IEvent[]> {
  return fetch(`http://localhost:8080/events?date_gte=${from}&date_lte=${to}&_sort=date,time`, {
    credentials: 'include'
  }).then(handleResponse);
}

export function getUserEndpoint(): Promise<IUser> {
  return fetch('http://localhost:8080/auth/user', {
    credentials: 'include'
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  });
}

export function sigInEndpoint(email: string, password: string): Promise<IUser> {
  return fetch(`http://localhost:8080/auth/login`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(handleResponse)
}

function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }
  else {
    return new Error(response.statusText);
  }
}