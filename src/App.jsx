import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/NavBar.jsx";
import Registeration from "./components/Registeration.jsx";
import CustomerList from "./components/CustomerList.jsx";
import ServerStatus from "./components/ServerStatus.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <ServerStatus />
        <div className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/register" element={<Registeration />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route
              path="/"
              element={
                <div className="text-center text-2xl mt-10">
                  Welcome to CustomerHub
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
