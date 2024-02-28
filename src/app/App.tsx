import { CalendarScreen } from "./components/CalendarScreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToday } from "./shared/dateFunctions";
import { useEffect, useState } from "react";
import { IUser, getUserEndpoint } from "./backend/backend";
import { LoginScreen } from "./components/LoginScreen";

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndpoint().then(
      setUser,
      () => setUser(null)
    )
  }, []);

  if(user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/calendar/:month" element={<CalendarScreen />} />
        </Routes>
        <Navigate to={`/calendar/${month}`} replace />
      </BrowserRouter>
    )
  } else {
    return (
      <LoginScreen onSignIn={setUser} />
    )
  }

}

export default App;
