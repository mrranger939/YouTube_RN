import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Navbar onMenuClick={handleMenuClick} />
      <div style={{ display: "flex", paddingTop: '66px' }}>
        <Sidebar sidebarOpen={sidebarOpen} />
        <div id="content" style={{ marginLeft: sidebarOpen ? '290px' : '0', transition: 'margin-left 0.3s ease-in-out', width: '100%' }}>
        
          <h1>hvibs</h1>
          <h1>hvibs</h1>
          <h1>hvibs</h1>
          <h1>hvibs</h1>
        </div>
      </div>
    </>
  );
}
