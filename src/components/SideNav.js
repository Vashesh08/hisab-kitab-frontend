import React, { useState } from 'react';
import Masterstoke from '../pages/Masterstoke';
import Sidebar from './Sidebar';
import Home from '../pages/Home';
import MeltingBook from '../pages/MeltingBook';

function SideNav() {
  const [currentPage, setCurrentPage] = useState('home');

  function handlePageChange(newPage){
    setCurrentPage(newPage);
  }

    return (
        <>
    <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button"
onClick={() => {
    const sidebar = document.getElementById('sidebar-multi-level-sidebar');
    const sidebar_right = document.getElementById('sidebar-right');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
      sidebar_right.classList.toggle('ml-64');
    }
  }} 
className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
   <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button>


<aside id="sidebar-multi-level-sidebar" className="fixed left-0 z-40 mt-1 w-64 h-screen transition-transform -translate-x-full" aria-label="Sidebar">
<Sidebar changeVisibility = {handlePageChange}/>
</aside>


<div id="sidebar-right" className="p-4">
   <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        {currentPage === "masterstock" ?(
          <Masterstoke />
          ) : currentPage === "meltingbook" ?(
            <MeltingBook />
          ) : (
            <Home />
          )
        }
   </div>
</div>
        </>
        
    )
}

export default SideNav;