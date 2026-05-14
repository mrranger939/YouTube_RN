import React, { useState, useEffect } from "react";
import Cards from "../components/Cards";
import "./Home.css";
import StubCards from "../components/StubCards";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function Home() {
  const [vidList, setVidList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchVidList = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/list/videos/cards`,
        );
        setVidList(data.data);
        console.log(data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchVidList();
  }, [API_BASE_URL]);

  if (loading) {
    return <StubCards />;
  }

  if (error) {
    return (
      <>
        <StubCards />
        Error: {error.message}
      </>
    );
  }

  if (vidList.length == 0) {
    return <StubCards />;
  }
  console.log(`the vidlist is ${vidList} type is: ${typeof vidList}`);
  return (
    <>
      <Cards vid_list={vidList} />
    </>
  );
}
