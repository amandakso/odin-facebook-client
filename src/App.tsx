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
import Friends from "./components/Friends";

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
            <Route
              path="/odin-facebook-client/"
              element={<PrivateRoute child={<Home />} />}
            ></Route>
            <Route
              path="/odin-facebook-client/profile/:username"
              element={<PrivateRoute child={<Profile />} />}
            ></Route>
            <Route
              path="/odin-facebook-client/friends"
              element={<PrivateRoute child={<Friends />} />}
            ></Route>
            <Route
              path="/odin-facebook-client/search"
              element={<PrivateRoute child={<Search />} />}
            ></Route>
            <Route
              path="/odin-facebook-client/settings"
              element={<PrivateRoute child={<Settings />} />}
            ></Route>
          </Route>
          <Route path="/odin-facebook-client/login" element={<Login />}></Route>
          <Route
            path="/odin-facebook-client/signup"
            element={<Signup />}
          ></Route>
          <Route path="/odin-facebook-client/*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
