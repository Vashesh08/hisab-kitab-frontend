import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar.js";
import MasterStock from "../pages/Masterstoke.js";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem("token");
      // send request to check authenticated
      console.log(localStorage);
      console.log("dashboaord", token);
      if (token === null) {
        navigate("/");
      }
      //   getMasterStock(token).then(data => {
      //         setDataAe(data);
      // })
    };
    checkLoggedIn();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <MasterStock />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
