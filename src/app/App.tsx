import { CalendarScreen } from "./components/CalendarScreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToday } from "./shared/dateFunctions";
import { useEffect, useState } from "react";
import { IUser, getUserEndpoint } from "./backend/backend";
import { LoginScreen } from "./components/LoginScreen";
import { authContext } from "./authContext";

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndpoint().then(
      setUser,
      () => setUser(null)
    )
  }, []);

  function onSignOut() {
    setUser(null);
  }

  if(user) {
    return (
      <authContext.Provider value={{user, onSignOut}}>
        <BrowserRouter>
          <Routes>
            <Route path="/calendar/:month" element={<CalendarScreen />} />
          </Routes>
          <Navigate to={`/calendar/${month}`} replace />
        </BrowserRouter>
      </authContext.Provider>
    )
  } else {
    return (
      <LoginScreen onSignIn={setUser} />
    )
  }

}

export default App;
