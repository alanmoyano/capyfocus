import { SpeedInsights } from "@vercel/speed-insights/next";

import Login from "./components/Login";

function App() {
  return (
    <>
      <SpeedInsights />
      <Login />
    </>
  );
}

export default App;
