import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Account from "./Account";
import Home from "./Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="account" element={<Account />} />
    </Routes>
  );
}

export default App;
