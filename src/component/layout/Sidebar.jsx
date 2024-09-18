import React from "react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <nav className="flex flex-col flex-grow p-4">
        <NavLink
          to=""
          className={`mb-4 p-2 rounded hover:bg-gray-700 transition-colors ${({isActive,isPending,isTransitioning })=>[isPending?"pending":"",isActive?"active":"",isTransitioning?"transitioning":""].join("")}`}
        >
          Home
        </NavLink>
        <NavLink
          to=""
          className={`mb-4 p-2 rounded hover:bg-gray-700 transition-colors ${({isActive,isPending,isTransitioning })=>[isPending?"pending":"",isActive?"active":"",isTransitioning?"transitioning":""].join("")}`}
        >
          About
        </NavLink>
        <NavLink
          to=""
          className={`mb-4 p-2 rounded hover:bg-gray-700 transition-colors ${({isActive,isPending,isTransitioning })=>[isPending?"pending":"",isActive?"active":"",isTransitioning?"transitioning":""].join("")}`}
        >
          Services
        </NavLink>
        <NavLink
          to=""
          className={`mb-4 p-2 rounded hover:bg-gray-700 transition-colors ${({isActive,isPending,isTransitioning })=>[isPending?"pending":"",isActive?"active":"",isTransitioning?"transitioning":""].join("")}`}
        >
          Contact
        </NavLink>
      </nav>
      <div className="p-4">© 2024 My Company</div>
    </div>
  );
}
