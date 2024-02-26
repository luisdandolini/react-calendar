import { getEvents } from "./backend/backend"
import { CalendarScreen } from "./components/CalendarScreen";

function App() {

  getEvents().then(events => {
    for(const event of events) {
      console.log(event);
    }
  })

  return (
    <>
      <CalendarScreen />
    </>
  )
}

export default App
