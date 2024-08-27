import { SpeedInsights } from "@vercel/speed-insights/react";

import { Link, Route, Switch } from "wouter";

import Login from "./components/Login";
import { useState } from "react";
import SignUp from "./components/SignUp";
import Pomodoro from "./components/Pomodoro";
import Timer from "./components/Timer";
import Badges from "./components/Badges";
import Navbar from "./components/Navbar";

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <div className="mb-4 flex items-center justify-center rounded-full bg-slate-400 p-4 dark:bg-slate-900">
      <p className="mr-4">Current theme: {theme}</p>
      <button className="rounded bg-primary px-4 py-2" onClick={toggleTheme}>
        change theme
      </button>
    </div>
  );
}

function App() {
  return (
    <>
      <SpeedInsights />
      {import.meta.env.VITE_THEME_CHANGER === "si" && <ThemeSwitcher />}

      <Navbar />

      <Switch>
        <Route
          path="/"
          component={() => (
            <>
              <h1>hola!</h1>
              <Link to="/login" className="font-bold text-primary">
                Login
              </Link>
            </>
          )}
        />

        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />

        <Route path="/pomodoro" component={Pomodoro} />
        <Route path="/timer" component={Timer} />

        <Route path="/badges" component={Badges} />

        <Route component={() => <>404!</>} />
      </Switch>
    </>
  );
}

export default App;
