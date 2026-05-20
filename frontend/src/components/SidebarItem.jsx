import React from "react";

const SidebarItem = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
    >
      {icon}
      <span className="ml-2 text-sm font-medium">{label}</span>
    </a>
  );
};

export default SidebarItem;