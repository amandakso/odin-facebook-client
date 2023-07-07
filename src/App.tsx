import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./PrivateRoute";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute child={<Home />} />}></Route>
          <Route
            path="/profile/:username"
            element={<PrivateRoute child={<Profile />} />}
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
