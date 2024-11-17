import React from 'react';
import Masterstoke from '../pages/Masterstoke';
import Sidebar from './Sidebar';
import Home from '../pages/Home';
import BalanceSheet from '../pages/BalanceSheet';
import MeltingBook from '../pages/MeltingBook';
import KareegarPage from '../pages/KareegarPage';
import LossAcct from '../pages/LossAcct';
import Polish from '../pages/Polish';
import VijayMeltingBook from '../pages/vijay/VijayMeltingBook';
import VijayTarPattaBook from '../pages/vijay/VijayTarPattaBook';
import VijayKareegarBook from '../pages/vijay/VijayKareegarBook';
import ManishKareegarBook from '../pages/vijay/ManishKareegarBook';
import Solder from '../pages/vijay/Solder';
import Joint from '../pages/vijay/Joint';
import GovindMeltingBook from '../pages/govind/GovindMeltingBook';
import GovindTarPattaBook from '../pages/govind/GovindTarPattaBook';
import GovindMachineBook from '../pages/govind/GovindMachineBook';
import GovindDaiBhuka from '../pages/govind/GovindDaiBhuka';
import GovindDaiBhuka835 from '../pages/govind/GovindDaiBhuka835';
import GovindCapMelting from '../pages/govindCapAccount/GovindCapMelting';
import GovindCapAccountBook from '../pages/govindCapAccount/GovindCapAccountBook';
import BabuMelting from '../pages/babu/BabuMelting';

function SideNav({ currentPage, handlePageChange, isVisible, setIsVisible }) {
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
className="z-50 top-1 fixed text-white inline-flex items-center p-2 mt-2 ms-3 text-sm hover:text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
   <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
</button>


<aside id="sidebar-multi-level-sidebar" className="fixed left-0 z-50 w-64 h-screen transition-transform -translate-x-full" aria-label="Sidebar">
<Sidebar changeVisibility = {handlePageChange} isVisible={isVisible} setIsVisible={setIsVisible}/>
</aside>


<div id="sidebar-right" className="p-4">
   <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        {currentPage === "balancesheet" ?(
          <BalanceSheet />
          ): currentPage === "masterstock" ?(
          <Masterstoke />
          ) : currentPage === "meltingbook" ?(
            <MeltingBook />
          ) : currentPage === "kareegardetails" ?(
            <KareegarPage />
          ) : currentPage === "lossacct" ?(
            <LossAcct />
          ) : currentPage === "polish" ?(
            <Polish />
          ) : currentPage === "govindmeltingbook" ?(
            <GovindMeltingBook />
          ) : currentPage === "govindtarpatta" ?(
            <GovindTarPattaBook />
          ) : currentPage === "govindmachine" ?(
            <GovindMachineBook />
          ) : currentPage === "govinddaibhuka" ?(
            <GovindDaiBhuka />
          ) : currentPage === "govinddaibhuka835" ?(
            <GovindDaiBhuka835 />
          ) : currentPage === "vijaymeltingbook" ?(
            <VijayMeltingBook />
          ) : currentPage === "vijaytarpatta" ?(
            <VijayTarPattaBook />
          ) : currentPage === "vijaykareegar" ?(
            <VijayKareegarBook />
          ) : currentPage === "manishkareegar" ?(
            <ManishKareegarBook />
          ) : currentPage === "solder" ?(
            <Solder />
          ) : currentPage === "joint" ?(
            <Joint />
          ) : currentPage === "babumelting" ?(
            <BabuMelting />
          ) : currentPage === "govindcapmelting" ?(
            <GovindCapMelting />
          ) : currentPage === "govindcapaccount" ?(
            <GovindCapAccountBook />
          ) : (
            <Home />
          )
          // govindmeltingbook govindtarpatta govindmachine govinddaibhukha govinddai
        }
   </div>
</div>
        </>
        
    )
}

export default SideNav;