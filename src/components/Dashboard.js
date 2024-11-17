import React, { useState } from "react";
import Navbar from "./Navbar.js";
import SideNav from "./SideNav.js";

function Dashboard({isVisible, checkLoggedIn, currentPage, setCurrentPage, setIsVisible}) {

  function handlePageChange(newPage){
    setCurrentPage(newPage);
  }

  return (
    <div>
      <Navbar checkLoggedIn={checkLoggedIn} handlePageChange={handlePageChange} isVisible={isVisible} setIsVisible={setIsVisible}/>
      <SideNav currentPage={currentPage} handlePageChange={handlePageChange} isVisible={isVisible} setIsVisible={setIsVisible}/>
    </div>
  );
}

export default Dashboard;
