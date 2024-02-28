import { CalendarScreen } from "./components/CalendarScreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToday } from "./shared/dateFunctions";

function App() {
const month = getToday().substring(0, 7);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/calendar/:month" element={<CalendarScreen />} />
      </Routes>
      <Navigate to={`/calendar/${month}`} />
    </BrowserRouter>
  )
}

export default App
