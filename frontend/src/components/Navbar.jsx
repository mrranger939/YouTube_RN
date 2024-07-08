import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faVideo, faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';

export default function App({ onMenuClick }) {
  return (
    <nav className="fixed w-full bg-white ">
      <div className="flex items-center justify-between px-4 py-2">
        <button id="menu" className="text-gray-700 px-2 mr-2" onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <a className="flex items-center" href="#">
          <img src="./images/youtube_logo-removebg-preview.png" alt="Logo" className="h-10 max-w-full" />
        </a>
        <form className="flex flex-grow max-w-lg mx-auto">
          <input className="form-input px-4 py-2 w-full border border-gray-300 rounded-l-md" type="search" placeholder="Search" aria-label="Search" />
          <button className="bg-gray-200 px-4 py-2 rounded-r-md" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <div className="flex items-center space-x-7 px-4">
          <button className="text-gray-700" type="button">
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button className="text-gray-700" type="button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="text-gray-700" type="button">
            <FontAwesomeIcon icon={faUserCircle} />
          </button>
        </div>
      </div>
    </nav>
  );
}
