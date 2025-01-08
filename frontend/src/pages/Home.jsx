import React, { useState, useEffect } from "react";
import Cards from "../components/Cards";
import "./Home.css";
import OGCards from "../components/Orginal_Cards";
import axios from "axios";

// import Hehe from "../components/Hehe";
export default function Home() {
  const [vidList, setVidList] = useState([]); // State to hold video list
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  const ipAddress = import.meta.env.VITE_IP_ADD; // Fetch IP from environment variable

  // Fetch video list on component mount
  useEffect(() => {
    const fetchVidList = async () => {
      try {
        const {data} = await axios.get(`http://${ipAddress}:8000/list`);
        console.log("Home :",data.data)
        setVidList(data.data); // Assuming response data is the list of videos
        console.log(`the vidlist is ${vidList} type is: ${typeof(vidList)}`)
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err); // Set error if there is any
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchVidList();
  }, [ipAddress]); // Dependency array to ensure fetch happens when component mounts

  // Render loading, error, or actual content
  if (loading) {
    return <OGCards />;
  }

  if (error) {
    return (
      <>
        <OGCards />
        Error: {error.message}
      </>
    );
  }

  if (vidList.length == 0) {
    return <OGCards />;
  }
  console.log(`the vidlist is ${vidList} type is: ${typeof(vidList)}`)
  console.log(vidList)
  return (
    <>
      <Cards vid_list={vidList} />
    </>
  );
}