import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import './Home.css'
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
    <div className="flex flex-col">
      <Navbar onMenuClick={handleMenuClick} />
      <div className="flex  mt-7" >
        <Sidebar sidebarOpen={sidebarOpen}  />
        <div
          id="content"
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} w-full pt-12`} >
          <h1>Content Here</h1>
          <h1>Content Here</h1>
          <h1>Content Here</h1>
          <h1>Content Here</h1>
          <h1>Content Here</h1>
          <h1>Content Here</h1>
          <h1>Content Here</h1>
          <h1>Content Here</h1><h1>Content Here</h1>



        </div>
      </div>
    </div>
    </>
  );
}
