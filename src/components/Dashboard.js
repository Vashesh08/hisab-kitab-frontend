import React, { useState } from "react";
import Navbar from "./Navbar.js";
import SideNav from "./SideNav.js";

function Dashboard({isVisible, checkLoggedIn, currentPage, setCurrentPage}) {

  function handlePageChange(newPage){
    setCurrentPage(newPage);
  }

  return (
    <div>
      <Navbar checkLoggedIn={checkLoggedIn} handlePageChange={handlePageChange}/>
      <SideNav currentPage={currentPage} handlePageChange={handlePageChange} isVisible={isVisible}/>
    </div>
  );
}

export default Dashboard;
