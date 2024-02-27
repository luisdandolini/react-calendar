import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, Button, Checkbox, FormControlLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon';

const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

interface ICalendarCell {
  date: string;
}

function generateCalendar(date: string): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T10:00:00");
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
      week.push({ date: isoDate })
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() <= currentMonth);

  return weeks
}

function getToday(): string {
  return "2021-06-01";
}

export function CalendarScreen() {
  const weeks = generateCalendar(getToday());


  return (
    <Box
      sx={{ display: 'flex', alignItems: 'stretch' ,height: '100%' }}
    >
      <Box sx={{ borderRight: '1px solid rgb(224, 224, 224)', width: "12em", padding: '.5rem 1rem' }}>
        <h2>Agenda React</h2>
        <Button sx={{ marginTop: '10px' }} variant="contained">Novo Evento</Button>

        <Box sx={{ marginTop: '64px', display: 'flex', flexDirection: 'column' }}>
          <h3>Agendas</h3>
          <FormControlLabel control={ <Checkbox color="success"/> } label="Pessoal" />
          <FormControlLabel control={ <Checkbox color="secondary" /> } label="Pessoal" />
        </Box>
      </Box>

      <TableContainer component={"div"}>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
          <Box sx={{ flex: '1' }}>
            <IconButton aria-label='Próximo anterior'>
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton aria-label='Próximo mês'>
              <Icon>chevron_right</Icon>
            </IconButton>
            <strong style={{ marginLeft: '16px' }}>Junho de 2021</strong>
          </Box>

          <IconButton aria-label='Informações do Usuário'>
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
        </Box>

        <Table sx={{ minHeight: '100%', borderTop: '1px solid rgb(224, 224, 224)' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {daysOfWeek.map((day) => 
                <TableCell align='center' key={day} sx={{ borderRight: '1px solid rgb(224, 224, 224)' }}>{day}</TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {weeks.map((week, index) => (
              <TableRow key={index}>
                {
                  week.map((cell) => (
                    <TableCell key={cell.date} align='center' sx={{ borderRight: '1px solid rgb(224, 224, 224)' }}>
                      {cell.date}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
