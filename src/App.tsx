import { SpeedInsights } from "@vercel/speed-insights/react";

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
