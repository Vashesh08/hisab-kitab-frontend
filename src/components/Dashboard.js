import React from "react";
import Navbar from "./Navbar.js";
import SideNav from "./SideNav.js";

function Dashboard(checkLoggedIn) {

  return (
    <div>
      <Navbar checkLoggedIn={checkLoggedIn}/>
      <SideNav />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
