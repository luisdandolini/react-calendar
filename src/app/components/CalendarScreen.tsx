import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon';
import { useEffect, useState } from 'react';
import { ICalendar, IEvent, IUser, getCalendars, getEvents } from '../backend/backend';
import { useParams } from 'react-router-dom';
import { addMonth, formatMonth } from '../shared/formatMonth';
import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';

const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

interface ICalendarHeaderProps {
  onSignOut: () => void;
  user: IUser;
}

type IEventWithCalendar = IEvent & { calendar: ICalendar }; 
interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}

function generateCalendar(date: string, allEvents: IEvent[], calendars: ICalendar[], calendarsSelected:boolean[]): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T12:00:00");
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < daysOfWeek.length; i++) {
      const isoDate = `
        ${currentDay.getFullYear()}-
        ${(currentDay.getMonth() + 1).toString().padStart(2, "0")}-
        ${currentDay.getDate().toString().padStart(2, "0")}
      `;

      const events: IEventWithCalendar[] = Array.isArray(allEvents)
        ? allEvents
            .map(event => {
              const callIndex = calendars.findIndex(cal => cal.id === event.calendarId);
              if (calendarsSelected[callIndex]) {
                return { ...event, calendar: calendars[callIndex] };
              }
              return null;
            })
            .filter(Boolean) as IEventWithCalendar[]  
        : [];

      week.push({ 
        dayOfMonth: currentDay.getDate(), 
        date: isoDate, 
        events,
      })
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() <= currentMonth);

  return weeks;
}


export function CalendarScreen(props: ICalendarHeaderProps) {
  const { month } = useParams<{ month: string }>();
  console.log(month)
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendarsSelected, setCalendarSelected] = useState<boolean[]>([]);
  const weeks = generateCalendar(month + "-01", events, calendars, calendarsSelected);
  const firsDate = weeks.length > 0 ? weeks[0][0].date : '';
  const lastDate = weeks.length > 0 ? weeks[weeks.length - 1][6].date : '';

  useEffect(() => {
    Promise.all([
      getCalendars(),
      getEvents(firsDate, lastDate)
    ]).then(([calendars, events]) => {
      if (Array.isArray(calendars)) {
        setCalendars(calendars);
        setCalendarSelected(calendars.map(() => true));
      }
      setEvents(events);
    });
  }, [firsDate, lastDate]);

  function toggleCalendar(i: number) {
    const newValue = [...calendarsSelected];
    newValue[i] = !newValue[i];
    setCalendarSelected(newValue);
  }

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'stretch' ,height: '100%' }}
    >
      <Box sx={{ borderRight: '1px solid rgb(224, 224, 224)', width: "12em", padding: '.5rem 1rem' }}>
        <h2>Agenda React</h2>
        <Button sx={{ marginTop: '10px' }} variant="contained">Novo Evento</Button>

        <Box sx={{ marginTop: '64px', display: 'flex', flexDirection: 'column' }}>
          <h3>Agendas</h3>
          {calendars && calendars.map((calendar, i) => (
            <FormControlLabel key={calendar.id} control={ 
              <Checkbox 
                checked={calendarsSelected[i]} 
                onChange={() => toggleCalendar(i)}
                style={{ 
                  color: calendar.color,
                }}/> 
              } 
              label={calendar.name} />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
          <Box sx={{ flex: '1' }}>

            <Link to={`/calendar/${addMonth(month ?? "", -1)}`}>
              <IconButton aria-label='Próximo anterior'>
                <Icon>chevron_left</Icon>
              </IconButton>
            </Link>

            <Link to={`/calendar/${addMonth(month ?? "", 1)}`}>
              <IconButton aria-label='Próximo mês'>
                <Icon>chevron_right</Icon>
              </IconButton>
            </Link>

            <strong style={{ marginLeft: '16px' }}>{ formatMonth(month ?? "") }</strong>
          </Box>

          <UserMenu user={props.user} onSignOut={props.onSignOut} />
        </Box>

        <TableContainer sx={{ flex: '1'}} component={"div"}>
          <Table sx={{ minHeight: '100%', borderTop: '1px solid rgb(224, 224, 224)' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {daysOfWeek.map((day) => 
                  <TableCell align='center' key={day} sx={{ borderRight: '1px solid rgb(224, 224, 224)' }}>
                    {day}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {weeks && weeks.map((week, index) => (
                <TableRow key={index}>
                  {
                    week && week.map((cell) => (
                      <TableCell key={cell.date} align='center' sx={{ borderRight: '1px solid rgb(224, 224, 224)' }}>
                        <div style={{ 
                            verticalAlign: "top", 
                            overflow: "hidden", 
                            padding: "8px 4px",
                            fontWeight: "500",
                            marginBottom : "8px", 
                          }}>
                          {cell.dayOfMonth}
                        </div>

                        {cell.events.map((event) => (
                          <button style={{ 
                              display: "flex",
                              alignItems: "center",
                              background: "none", 
                              border: "none", 
                              cursor: "pointer", 
                              textAlign: "left",
                              whiteSpace: "nowrap",
                              margin: "4px 0px",
                            }}>
                            {event.time && <Icon fontSize='inherit'>watch_later {event.time}</Icon>}
                            {event.time && <span style={{ margin: "0px 4px" }}>{event.time}</span>}
                            <span>{event.desc}</span>
                          </button>
                        ))}
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>       

    </Box>
  )
}
