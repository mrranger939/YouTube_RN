import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
  return (
    <form className="flex flex-grow py-1 max-w-xl mx-auto">
      <input
        className="form-input px-4 py-1 w-full border border-gray-300 rounded-l-full"
        id="search_key"
        name="search_key"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button
        className="bg-gray-200 px-6 py-1 rounded-r-full"
        title="Search"
        type="submit"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
}