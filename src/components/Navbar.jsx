import React from 'react';
import { Menu} from 'lucide-react';
import logo from '../assets/logoo.png';
import { IoSettingsOutline } from "react-icons/io5";
import { IoNotificationsCircle } from "react-icons/io5";
import { TbFilter } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white text-white flex items-center justify-between px-4 z-50 shadow-lg">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onToggleSidebar}>
          <Menu />
        </button>
        <img className='w-20' src={logo} alt="" />
      </div>
      <div className='flex w-full justify-end items-center gap-2'>
        <div className='flex items-center w-full  border-black justify-end'>
          <TbFilter className='text-black text-2xl hover:text-gray-500' />
                  <input type="text" className='p-2 ml-2
                   w-[40%] border border-black outline-black text-black rounded-md' placeholder='Search multiple vehicles' />
                  <button className='bg-black text-white p-2 rounded-md'>Search</button>
        </div>

        <div className='flex items-center gap-3'>
                  <IoSettingsOutline className='text-white text-2xl bg-green-900 w-7 h-7 p-1 rounded-[50%]' />
        <IoNotificationsCircle className='text-white text-2xl bg-orange-600 w-7 h-7 p-1 rounded-[50%]' />
        <FaUser className='text-white text-2xl bg-red-900 w-7 h-7 p-2 rounded-[50%]' />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
