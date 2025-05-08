import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/routeConfig";

function App() {
  const isAuthenticated = true;

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={React.createElement(element)} />
      ))}
    </Routes>
  );
}

export default App;
