import React from "react";
import "./Sidebar.css";
import { ScrollShadow } from "@heroui/react";

import SidebarItem from "./SidebarItem";

import {
  mainLinks,
  youLinks,
  exploreLinks,
  accountLinks
} from "../Data/sidebarData";

const Sidebar = ({ sidebarOpen }) => {
  return (
    <div
      className={`sidebar ${
        sidebarOpen ? "open" : ""
      } w-48 flex flex-col items-center rounded`}
      style={{
        overflowY: "auto",
        height: "calc(100vh - 74px)",
      }}
    >
      <ScrollShadow size={100} className="w-full">
        <div className="w-full px-2">

          {/* Main */}
          <div className="flex flex-col items-center w-full">
            {mainLinks.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>

          <hr />

          {/* You */}
          <div className="mt-2">
            <h3 className="px-3 font-medium">You</h3>

            {youLinks.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>

          <hr />

          {/* Explore */}
          <div className="mt-2">
            <h3 className="px-3 font-medium">
              Explore
            </h3>

            {exploreLinks.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>

          <hr/>

          {accountLinks.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}

        </div>
      </ScrollShadow>
    </div>
  );
};

export default Sidebar;