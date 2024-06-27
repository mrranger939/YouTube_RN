import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faVideo, faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ position: "fixed", width: '100%' }}>
      <div className="container-fluid">
        <button id="menu" className="btn" onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <a className="navbar-brand" href="#">
          <img src="./images/youtube_logo-removebg-preview.png" alt="Logo" height="40" />
        </a>
        <form className="d-flex mx-auto" style={{ maxWidth: "600px", flex: 1 }}>
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <div className="d-flex">
          <button className="btn btn-light me-2" type="button">
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button className="btn btn-light me-2" type="button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="btn btn-light" type="button">
            <FontAwesomeIcon icon={faUserCircle} />
          </button>
        </div>
      </div>
    </nav>
  );
}
