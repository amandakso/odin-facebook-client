import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./PrivateRoute";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<PrivateRoute child={<Home />} />}></Route>
            <Route
              path="/profile/:username"
              element={<PrivateRoute child={<Profile />} />}
            ></Route>
            <Route
              path="/search"
              element={<PrivateRoute child={<Search />} />}
            ></Route>
            <Route
              path="/settings"
              element={<PrivateRoute child={<Settings />} />}
            ></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
